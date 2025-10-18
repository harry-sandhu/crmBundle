import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50 text-center px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          About GrowLifeSuprimo 🌱
        </h2>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          <strong>GrowLifeSuprimo</strong> is a new-age <strong>MLM organization</strong> 
          built on trust, growth, and empowerment. We are redefining the multi-level marketing 
          landscape by blending innovation, transparency, and a community-first approach.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Our platform enables individuals to <strong>build networks</strong>, 
          <strong>earn passive income</strong>, and <strong>unlock financial freedom</strong> 
          through teamwork, learning, and leadership. Every member becomes part of a 
          powerful movement that thrives on mutual growth and long-term success.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          Whether you’re a newcomer exploring opportunities or a leader expanding your 
          organization, GrowLifeSuprimo offers the system, tools, and mentorship to help 
          you <strong>grow without limits</strong>.
        </p>

        <div className="mt-10">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200"
            alt="Team Growth and Success"
            className="rounded-2xl shadow-lg mx-auto w-full md:w-3/4 object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
