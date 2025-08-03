/* -------------  Cloud Functions: Botify  ------------- */
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* -------- initialise Firebase Admin (fast, no I/O) -------- */
admin.initializeApp();
const db = admin.firestore();

/* -------- helpers -------- */
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const nowMs = () => Date.now();

const DISPOSABLE = new Set([
  "mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com",
  "yopmail.com","discard.email","sharklasers.com","getnada.com","temp-mail.org",
  "trashmail.com","moakt.com","tempail.com","mail7.io",
]);

/* -------- SMTP transport: LAZY init to avoid load-time stalls -------- */
const mailFrom = functions.config().mail?.from || "Botify <noreply@botify.local>";

let _transport = null;
function getTransport() {
  if (_transport) return _transport;
  try {
    const cfg = functions.config().smtp || {};
    const host = cfg.host;
    const port = Number(cfg.port);
    const user = cfg.user;
    const pass = cfg.pass;

    if (host && port && user && pass) {
      _transport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      console.info("✅ SMTP transport ready");
    } else {
      console.warn("⚠️  SMTP not configured — OTP will be logged to console.");
      _transport = null;
    }
  } catch (e) {
    console.warn("⚠️  nodemailer setup failed — OTPs will be logged only.", e);
    _transport = null;
  }
  return _transport;
}

async function sendEmail(to, subject, text) {
  const tx = getTransport();
  if (!tx) {
    // Safe fallback for dev or missing SMTP
    console.log(`[DEV EMAIL] to=${to}  subject=${subject}  text=${text}`);
    return;
  }
  await tx.sendMail({ from: mailFrom, to, subject, text });
}

/* -------- Common run options (v1 SDK) -------- */
const runOptsFast = { region: "us-central1", timeoutSeconds: 5,  memory: "128MB" };
const runOptsCall = { region: "us-central1", timeoutSeconds: 20, memory: "256MB" };

/* --------------------------------------------------- */
/* -------- Blocking Triggers (Auth v2 in v1 SDK) ----- */

/* 1️⃣  beforeCreate — validate + rate-limit sign-ups */
export const beforeCreate = functions
  .runWith(runOptsFast)
  .auth.user()
  .beforeCreate(async (user, context) => {
    const email = (user.email || "").toLowerCase();
    const domain = email.split("@")[1];

    if (!email || !domain) {
      throw new functions.auth.HttpsError("failed-precondition", "Email required.");
    }
    if (DISPOSABLE.has(domain)) {
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
      throw new functions.auth.HttpsError("resource-exhausted", "Too many sign-ups from this IP.");
    }
    await ipDoc.set({ count: count + 1, ts: now }, { merge: true });
  });

/* 2️⃣  beforeSignIn — block flagged accounts */
export const beforeSignIn = functions
  .runWith(runOptsFast)
  .auth.user()
  .beforeSignIn(async (user, context) => {
    if (context.authToken?.blocked) {
      throw new functions.auth.HttpsError("permission-denied", "Account blocked.");
    }
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

      return { ok: true };
    } catch (err) {
      console.error("requestEmailOtp error:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError("internal", "Could not send OTP. Try again.");
    }
  });

/* ---------- Callable: verifyEmailOtp (production) --- */
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
      if (userDoc.active === true) {
        // Already activated: keep idempotent
        return { ok: true };
      }

      const id = sha256(code);
      const otpRef  = db.doc(`users/${uid}/otps/${id}`);
      const otpSnap = await otpRef.get();
      if (!otpSnap.exists)            return { ok:false, message:"Invalid or expired code." };
      const otp = otpSnap.data();
      if (otp.used === true)          return { ok:false, message:"Invalid or expired code." };
      if (otp.exp.toMillis() < nowMs())
        return { ok:false, message:"Invalid or expired code." };

      // Transaction: only writes (reads done above)
      await db.runTransaction(async (tx) => {
        tx.update(otpRef, { used: true });
        tx.update(userRef, {
          active: true,
          activatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        if (userDoc.companyId) {
          tx.update(db.doc(`companies/${userDoc.companyId}`), { status: "active" });
        }
      });

      // Mark Auth user as email verified so route guards pass immediately
      try {
        await admin.auth().updateUser(uid, { emailVerified: true });
      } catch (e) {
        console.warn("verifyEmailOtp: updateUser(emailVerified) failed:", e);
      }

      // Set custom claims (do not fail flow if this errors)
      try {
        await admin.auth().setCustomUserClaims(uid, {
          ...(userDoc.role ? { role: userDoc.role } : {}),
          active: true,
          tier: userDoc.tier || "free",
        });
      } catch (e) {
        console.warn("setCustomUserClaims failed (continuing):", e);
      }

      return { ok: true };
    } catch (err) {
      console.error("verifyEmailOtp error:", err);
      if (err instanceof functions.https.HttpsError) throw err;
      throw new functions.https.HttpsError("internal", "Verification failed. Try again.");
    }
  });
