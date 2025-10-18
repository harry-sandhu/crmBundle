import React from "react";
import { motion } from "framer-motion";

export default function Vision() {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-green-50 to-emerald-50 text-center px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-green-700 mb-6">Our Vision 💫</h2>

        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          To create a <strong>global ecosystem</strong> where individuals achieve 
          <strong>financial independence</strong> and <strong>personal growth</strong> 
          through a transparent and ethical MLM network.
        </p>

        <p className="text-gray-600 text-md leading-relaxed">
          We aim to eliminate outdated MLM practices by introducing modern systems, 
          digital transparency, and fair compensation. Our vision is to build a 
          <strong>community of entrepreneurs</strong> who lead with integrity, empower others, 
          and redefine what success truly means.
        </p>

        <div className="mt-10">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"

            alt="Empowerment and Leadership"
            className="rounded-2xl shadow-lg mx-auto w-full md:w-3/4 object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
