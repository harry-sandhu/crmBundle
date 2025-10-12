import nodemailer from "nodemailer";

console.log("========================================");
console.log("📧 Email Service (Gmail mode)");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Not Loaded");
console.log("========================================\n");

const emailConfigured =
  !!process.env.EMAIL_USER &&
  !!process.env.EMAIL_PASS &&
  process.env.EMAIL_USER.trim() !== "" &&
  process.env.EMAIL_PASS.trim() !== "";

let transporter: nodemailer.Transporter;

if (emailConfigured) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) console.error("❌ Transporter verify failed:", err.message);
    else console.log("✅ Gmail transporter ready to send emails.");
  });
} else {
  console.warn("⚠️ Missing EMAIL_USER or EMAIL_PASS — Mocking emails.");
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export const sendOtpEmail = async (email: string, otp: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const html = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <p>Hello,</p>
      <p>Your verification code is:</p>
      <h2 style="letter-spacing:6px;font-size:24px;">${otp}</h2>
      <p>This code is valid for 10 minutes.</p>
      <hr/>
      <small><a href="${frontendUrl}">${frontendUrl}</a></small>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your BundleMaker verification code",
      html,
    });

    console.log("✅ Email sent successfully to:", email);
    return info;
  } catch (err: any) {
    console.error("❌ sendOtpEmail error:", err.message);
    throw err;
  }
};
