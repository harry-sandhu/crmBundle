// backend/src/utils/sendEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Bundle Maker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    html: `<p>Your verification OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, link: string) => {
  await transporter.sendMail({
    from: `"Bundle Maker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Reset your password using this link: <a href="${link}">${link}</a></p>`,
  });
};
