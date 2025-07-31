import admin from "firebase-admin";
import * as functions from "firebase-functions";
import crypto from "crypto";
import nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

// ---------- helpers ----------
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

const DISPOSABLE = new Set([
  "mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com",
  "yopmail.com","discard.email","sharklasers.com","getnada.com","temp-mail.org",
  "trashmail.com","moakt.com","tempail.com","mail7.io"
]);

const mailFrom = (functions.config().mail?.from) || "Botify <noreply@botify.local>";
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
  }
} catch (e) {
  console.warn("SMTP not configured, OTPs will be logged in console only.");
}

async function sendEmail(to, subject, text) {
  if (!transporter) {
    console.log(`[DEV EMAIL] to=${to} subject=${subject} text=${text}`);
    return;
  }
  await transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    text,
  });
}

// ---------- Blocking: beforeCreate ----------
export const beforeCreate = functions.auth.user().beforeCreate(async (user, context) => {
  const email = (user.email || "").toLowerCase();
  const domain = email.split("@")[1];

  if (!email || !domain) {
    throw new functions.auth.HttpsError("failed-precondition", "Email required.");
  }

  // block disposable domains
  if (DISPOSABLE.has(domain)) {
    throw new functions.auth.HttpsError("failed-precondition", "Disposable email not allowed.");
  }

  // rate-limit signups by IP (3 per 24h)
  const ip = context.ipAddress || context.rawRequest?.ip || "unknown";
  const ipRef = db.collection("signup_ips").doc(sha256(ip));
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ipRef);
    const now = Date.now();
    if (!snap.exists) {
      tx.set(ipRef, { count: 1, ts: now });
      return;
    }
    let { count, ts } = snap.data();
    if (now - ts > 24 * 3600 * 1000) {
      count = 0; ts = now;
    }
    if (count >= 3) {
      throw new functions.auth.HttpsError("resource-exhausted", "Too many signups from this IP.");
    }
    tx.set(ipRef, { count: count + 1, ts: now });
  });
});

// ---------- Blocking: beforeSignIn (optional block logic) ----------
export const beforeSignIn = functions.auth.user().beforeSignIn(async (user, context) => {
  // Example: if custom claim 'blocked' is true => block login
  const token = context.authToken || {};
  if (token.blocked) {
    throw new functions.auth.HttpsError("permission-denied", "Account blocked.");
  }
});

// ---------- Callable: requestEmailOtp ----------
export const requestEmailOtp = functions.https.onCall(async (data, context) => {
  if (!context.app) {
    // App Check required
    throw new functions.https.HttpsError("failed-precondition", "App Check required.");
  }
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required.");
  }

  const uid = context.auth.uid;
  const user = await admin.auth().getUser(uid);
  if (!user.email) {
    throw new functions.https.HttpsError("failed-precondition", "No email on account.");
  }

  // throttle: 3 OTPs/hour
  const limiterRef = db.collection("otp_limits").doc(uid);
  await db.runTransaction(async (tx) => {
    const s = await tx.get(limiterRef);
    const now = Date.now();
    if (!s.exists) {
      tx.set(limiterRef, { count: 1, ts: now });
      return;
    }
    const { count, ts } = s.data();
    if (now - ts < 3600 * 1000 && count >= 3) {
      throw new functions.https.HttpsError("resource-exhausted", "Too many OTP requests.");
    }
    if (now - ts < 3600 * 1000) {
      tx.update(limiterRef, { count: count + 1 });
    } else {
      tx.set(limiterRef, { count: 1, ts: now });
    }
  });

  // generate & store OTP
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const otpRef = db.collection("users").doc(uid).collection("otps").doc();
  await otpRef.set({
    hash: sha256(code),
    exp: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000),
    used: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await sendEmail(
    user.email,
    "Your Botify verification code",
    `Your one-time verification code is ${code}. It expires in 10 minutes.`
  );

  return { ok: true };
});

// ---------- Callable: verifyEmailOtp ----------
export const verifyEmailOtp = functions.https.onCall(async (data, context) => {
  if (!context.app) {
    throw new functions.https.HttpsError("failed-precondition", "App Check required.");
  }
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required.");
  }

  const uid = context.auth.uid;
  const code = String(data?.code || "");
  if (!/^\d{6}$/.test(code)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid code format.");
  }

  const otpsSnap = await db
    .collection("users").doc(uid).collection("otps")
    .orderBy("createdAt", "desc").limit(10).get();

  const now = Date.now();
  const h = sha256(code);
  let matchedDoc = null;

  otpsSnap.forEach((d) => {
    const x = d.data();
    if (!x.used && x.hash === h && x.exp.toMillis() >= now) {
      matchedDoc = d;
    }
  });

  if (!matchedDoc) return { ok: false, message: "Invalid or expired code." };
  await matchedDoc.ref.update({ used: true });

  // activate account
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new functions.https.HttpsError("failed-precondition", "User document missing.");
  }
  const userDoc = userSnap.data();
  const companyId = userDoc.companyId;

  await db.runTransaction(async (tx) => {
    tx.update(userRef, { active: true, activatedAt: admin.firestore.FieldValue.serverTimestamp() });
    if (companyId) {
      tx.update(db.collection("companies").doc(companyId), { status: "active" });
    }
  });

  // set custom claims (used by Firestore rules)
  await admin.auth().setCustomUserClaims(uid, {
    ...(userDoc.role ? { role: userDoc.role } : {}),
    active: true,
    tier: userDoc.tier || "free",
  });

  return { ok: true };
});
