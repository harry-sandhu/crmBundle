//     import { Request, Response, NextFunction } from "express";
//     import bcrypt from "bcryptjs";

// export async function adminLoginCheck(req: Request, res: Response) {
// try {
// const { email, password } = req.body as { email: string; password: string };
// if (!email || !password) {
// return res.status(400).json({ success: false, message: "Email and password required" });
// }
// const adminEmail = process.env.ADMIN_EMAIL!;
// const adminHash = process.env.ADMIN_PASSWORD_HASH!;
// if (email.toLowerCase() !== adminEmail.toLowerCase()) {
// return res.status(401).json({ success: false, message: "Invalid admin credentials" });
// }
// const ok = await bcrypt.compare(password, adminHash);
// if (!ok) {
// return res.status(401).json({ success: false, message: "Invalid admin credentials" });
// }
// return res.json({ success: true, message: "Admin login ok" });
// } catch (e: any) {
// return res.status(500).json({ success: false, message: "Server error" });
// }
// }

// export function adminOnly(req: Request, res: Response, next: NextFunction) {
// try {
// const adminEmail = process.env.ADMIN_EMAIL!;
// // req.user is set by verifyToken after normal login
// if (!req.user?.email || req.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
// return res.status(403).json({ success: false, message: "Forbidden: admin only" });
// }
// return next();
// } catch (e: any) {
// return res.status(403).json({ success: false, message: "Forbidden" });
// }
// }