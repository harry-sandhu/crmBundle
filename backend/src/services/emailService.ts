// backend/src/services/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "465", 10),
  secure: (process.env.EMAIL_SECURE === "true") || true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const html = `
    <div>
      <p>Hello,</p>
      <p>Your verification code is:</p>
      <h2 style="letter-spacing:6px">${otp}</h2>
      <p>This code is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore.</p>
      <hr/>
      <small><a href="${frontendUrl}">${frontendUrl}</a></small>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your BundleMaker verification code",
      html,
    });
  } catch (err) {
    console.error("sendOtpEmail error:", err);
    
    throw err;
  }
};
