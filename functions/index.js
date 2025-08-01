/* -------------  Cloud Functions: Botify  ------------- */
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* -------- initialise Firebase Admin -------- */
admin.initializeApp();
const db = admin.firestore();

/* -------- helpers -------- */
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const nowMs = () => Date.now();

const DISPOSABLE = new Set([
  "mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com",
  "yopmail.com", "discard.email", "sharklasers.com", "getnada.com", "temp-mail.org",
  "trashmail.com", "moakt.com", "tempail.com", "mail7.io",
]);

/* -------- SMTP transport (optional in dev) -------- */
const mailFrom = functions.config().mail?.from || "Botify <noreply@botify.local>";

let transporter = null;
try {
  const { host, port, user, pass } = functions.config().smtp || {};
  if (host && port && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
    console.info("✅ SMTP transport initialised");
  } else {
    console.warn("⚠️  SMTP not configured — OTP will be logged to console.");
  }
} catch (e) {
  console.warn("⚠️  nodemailer transport failed — OTP will be logged to console.", e);
}

async function sendEmail(to, subject, text) {
  if (!transporter) {
    console.log(`[DEV EMAIL] to=${to}  subject=${subject}  text=${text}`);
    return;
  }
  await transporter.sendMail({ from: mailFrom, to, subject, text });
}

/* -------- Common run options -------- */
const runOptsFast = { region: "us-central1", timeoutSeconds: 5,  memory: "128MB" };
const runOptsCall = { region: "us-central1", timeoutSeconds: 20, memory: "256MB" };

/* --------------------------------------------------- */
/* -------- Blocking Triggers (Auth v2)  ------------- */

/* 1️⃣  beforeCreate — validate + rate-limit sign-ups */
export const beforeCreate = functions
  .runWith(runOptsFast)
  .auth.user()
  .beforeCreate(async (user, context) => {
    const email = (user.email || "").toLowerCase();
    const domain = email.split("@")[1];

    if (!email || !domain) {
      console.warn("❌ beforeCreate: missing email");
      throw new functions.auth.HttpsError("failed-precondition", "Email required.");
    }

    if (DISPOSABLE.has(domain)) {
      console.warn("❌ beforeCreate: disposable domain", email);
      throw new functions.auth.HttpsError("failed-precondition", "Disposable email not allowed.");
    }

    // ≤3 sign-ups / 24h / IP
    const ip = context.ipAddress || context.rawRequest?.ip || "unknown";
    const ipDoc = db.doc(`signup_ips/${sha256(ip)}`);
    const now = nowMs();

    const snap = await ipDoc.get();
    let { count = 0, ts = now } = snap.exists ? snap.data() : {};
    if (now - ts > 86_400_000) count = 0; // reset after 24 h
    if (count >= 3) {
      console.warn("❌ beforeCreate: IP limit reached", ip);
      throw new functions.auth.HttpsError("resource-exhausted", "Too many sign-ups from this IP.");
    }
    await ipDoc.set({ count: count + 1, ts: now }, { merge: true });

    console.info("✅ beforeCreate ok for", email);
  });

/* 2️⃣  beforeSignIn — block flagged accounts */
export const beforeSignIn = functions
  .runWith(runOptsFast)
  .auth.user()
  .beforeSignIn(async (user, context) => {
    if (context.authToken?.blocked) {
      console.warn("❌ beforeSignIn: blocked UID", user.uid);
      throw new functions.auth.HttpsError("permission-denied", "Account blocked.");
    }
    console.info("✅ beforeSignIn ok:", user.uid);
  });

/* --------------------------------------------------- */
/* -------- Callable: requestEmailOtp ----------------- */
export const requestEmailOtp = functions
  .runWith(runOptsCall)
  .https.onCall(async (_data, context) => {
    try {
      if (!context.app)
        throw new functions.https.HttpsError("failed-precondition", "App Check required.");
      if (!context.auth)
        throw new functions.https.HttpsError("unauthenticated", "Login required.");

      const uid = context.auth.uid;
      const user = await admin.auth().getUser(uid);
      if (!user.email)
        throw new functions.https.HttpsError("failed-precondition", "No email on account.");

      // throttle: 3 OTPs / hour / uid
      const limDoc = db.doc(`otp_limits/${uid}`);
      const now = nowMs();
      const limSnap = await limDoc.get();
      let { count = 0, ts = now } = limSnap.exists ? limSnap.data() : {};
      if (now - ts > 3_600_000) count = 0; // reset hourly
      if (count >= 3)
        throw new functions.https.HttpsError("resource-exhausted", "Too many OTP requests.");
      await limDoc.set({ count: count + 1, ts: now }, { merge: true });

      // generate & store OTP as docId = sha256(code)
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const id = sha256(code);
      await db.doc(`users/${uid}/otps/${id}`).set({
        hash: id,
        exp: admin.firestore.Timestamp.fromMillis(now + 10 * 60 * 1000),
        used: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await sendEmail(
        user.email,
        "Your Botify verification code",
        `Your one-time verification code is ${code}. It expires in 10 minutes.`
      );

      console.info("📧 OTP emailed to", user.email);
      return { ok: true };
    } catch (err) {
      console.error("requestEmailOtp error:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError("internal", "Could not send OTP. Try again.");
    }
  });

/* ---------- Callable: verifyEmailOtp (hardened) ----- */
export const verifyEmailOtp = functions
  .runWith(runOptsCall)
  .https.onCall(async (data, context) => {
    try {
      if (!context.app)
        throw new functions.https.HttpsError("failed-precondition", "App Check required.");
      if (!context.auth)
        throw new functions.https.HttpsError("unauthenticated", "Login required.");

      const uid  = context.auth.uid;
      const code = String(data?.code || "");
      if (!/^\d{6}$/.test(code))
        throw new functions.https.HttpsError("invalid-argument", "Invalid code format.");

      const userRef = db.doc(`users/${uid}`);
      const userSnap = await userRef.get();
      if (!userSnap.exists)
        throw new functions.https.HttpsError("failed-precondition", "User document missing.");

      const userDoc = userSnap.data() || {};
      // Idempotency: already active? OK.
      if (userDoc.active === true) {
        console.info("verifyEmailOtp: already active", uid);
        return { ok: true };
      }

      const id = sha256(code);
      const otpRef  = db.doc(`users/${uid}/otps/${id}`);
      const otpSnap = await otpRef.get();
      if (!otpSnap.exists)          return { ok:false, message:"Invalid or expired code." };
      const otp = otpSnap.data();
      if (otp.used === true)        return { ok:false, message:"Invalid or expired code." };
      if (otp.exp.toMillis() < nowMs())
        return { ok:false, message:"Invalid or expired code." };

      await db.runTransaction(async (tx) => {
        // 1) mark OTP used
        tx.update(otpRef, { used: true });

        // 2) activate user
        tx.update(userRef, {
          active: true,
          activatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 3) activate company if present
        const latestUser = (await tx.get(userRef)).data() || userDoc;
        if (latestUser.companyId) {
          tx.update(db.doc(`companies/${latestUser.companyId}`), { status: "active" });
        }
      });

      // 4) set custom claims (role/tier preserved)
      await admin.auth().setCustomUserClaims(uid, {
        ...(userDoc.role ? { role: userDoc.role } : {}),
        active: true,
        tier: userDoc.tier || "free",
      });

      console.info("✅ verifyEmailOtp: account activated", uid);
      return { ok: true };
    } catch (err) {
      console.error("verifyEmailOtp error:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError("internal", "Verification failed. Try again.");
    }
  });
