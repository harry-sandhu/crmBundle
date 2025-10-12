import nodemailer from "nodemailer";

// 🧠 Log configuration status
console.log("========================================");
console.log("📧 Email Service (utils/sendEmail.ts)");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Not Loaded");
console.log("========================================\n");

// ===========================================================
// 🧩 1️⃣ Decide which transporter to use
// ===========================================================

let transporter: nodemailer.Transporter;

// ✅ If in production → use Gmail
if (process.env.NODE_ENV === "production") {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("❌ Gmail transporter verification failed:", err.message);
    } else {
      console.log("✅ Gmail transporter verified and ready to send emails.");
    }
  });
}
// ✅ If in development → use Mailtrap (safe fake inbox)
else {
  transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.MAILTRAP_PORT || 587),
    auth: {
      user: process.env.MAILTRAP_USER || "your_mailtrap_username",
      pass: process.env.MAILTRAP_PASS || "your_mailtrap_password",
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("❌ Mailtrap transporter verification failed:", err.message);
    } else {
      console.log("✅ Mailtrap transporter ready (for local testing).");
    }
  });
}

// ===========================================================
// 📨 2️⃣ OTP Email
// ===========================================================
export const sendOtpEmail = async (email: string, otp: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const html = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <p>Hello,</p>
      <p>Your verification code for <b>Bundle Maker</b> is:</p>
      <h2 style="letter-spacing:4px;font-size:22px;">${otp}</h2>
      <p>This code will expire in <b>10 minutes</b>.</p>
      <p>If you didn’t request this, please ignore this email.</p>
      <hr/>
      <small><a href="${frontendUrl}">${frontendUrl}</a></small>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Bundle Maker" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Bundle Maker Verification Code",
      html,
    });

    console.log("✅ OTP email sent successfully to:", email);
    if (process.env.NODE_ENV !== "production") {
      console.log("🧪 (Preview in Mailtrap dashboard)");
    }
    return info;
  } catch (err: any) {
    console.error("❌ sendOtpEmail error:", err.message);
    throw err;
  }
};

// ===========================================================
// 🔑 3️⃣ Password Reset Email
// ===========================================================
export const sendPasswordResetEmail = async (email: string, link: string) => {
  const html = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <p>Hello,</p>
      <p>We received a request to reset your <b>Bundle Maker</b> password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${link}" style="color:#1a73e8;">${link}</a>
      <p>If you didn’t request this, please ignore this email.</p>
      <hr/>
      <small>This link will expire in 1 hour.</small>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Bundle Maker" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Bundle Maker Password",
      html,
    });

    console.log("✅ Password reset email sent to:", email);
    if (process.env.NODE_ENV !== "production") {
      console.log("🧪 (Preview in Mailtrap dashboard)");
    }
    return info;
  } catch (err: any) {
    console.error("❌ sendPasswordResetEmail error:", err.message);
    throw err;
  }
};
