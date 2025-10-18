import React from "react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white text-center py-10 mt-12 shadow-inner border-t border-green-600">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo / Name */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-yellow-300 tracking-wide">
            GrowLifeSuprimo 🌱
          </h2>
          <p className="text-gray-200 text-sm mt-2 max-w-sm">
            Empowering networks. Building futures. Creating leaders through trust and teamwork.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-yellow-300 text-sm font-medium">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">About Us</a>
          <a href="#" className="hover:text-white transition">Vision</a>
          <a href="#" className="hover:text-white transition">Contact</a>
          <a href="#" className="hover:text-white transition">Terms</a>
        </div>

        {/* Socials (using emojis instead of icons) */}
        <div className="flex justify-center md:justify-end gap-4 text-yellow-300 text-lg">
          <a href="#" className="hover:text-white transition" aria-label="Facebook">📘</a>
          <a href="#" className="hover:text-white transition" aria-label="Instagram">📸</a>
          <a href="#" className="hover:text-white transition" aria-label="LinkedIn">💼</a>
          <a href="mailto:support@growlifesuprimo.com" className="hover:text-white transition" aria-label="Email">✉️</a>
        </div>
      </div>

      {/* Divider Line */}
      <div className="my-6 mx-auto w-3/4 border-t border-green-500 opacity-30"></div>

      {/* Bottom Section */}
      <div className="space-y-2">
        <p className="text-gray-200 text-sm">
          © {new Date().getFullYear()} <strong>GrowLifeSuprimo</strong>. All rights reserved.
        </p>
        <p className="text-yellow-300 text-sm">
          Made with <span className="animate-pulse inline-block">❤️</span> by <strong>Phoenix™</strong>
        </p>
      </div>

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
    </footer>
  );
}
