import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export default {
  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${name}, Verify your email: <a href="${url}">${url}</a></p>`
    });
  },
  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Hello ${name}, Reset your password here: <a href="${url}">${url}</a></p>`
    });
  }
};
