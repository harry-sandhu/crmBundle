import  { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const leaders = [
    {
      name: "Vijay Kumar",
      role: "Founder &  Leader",
      img:  "../../public/Vijay.png"
,
    },
    {
      name: "Virendra Kumar",
      role: "Founder & Leader",
      img: "../../public/Virendra.jpeg"
    },
    // {
    //   name: "Vivek Sharma",
    //   role: "Operations & Network Director",
    //   img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600",
    // },
  ];

  const testimonials = [
    {
      name: "Virendra Kumar",
      feedback:
        "GrowLifeSuprimo has given me financial confidence and a community that supports real growth!",
    },
    {
      name: "Vijay Kumar",
      feedback:
        "I started small, but within months I built a strong team. The system really works!",
    },
    {
      name: "Raj",
      feedback:
        "This company isn’t just MLM — it’s mentorship and empowerment combined.",
    },
  ];

  // Auto-slide logic
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, );

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-800">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative z-10 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to GrowLifeSuprimo 🌱
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Empowering People. Growing Lives. Building Success.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg shadow-md transition">
            Join the Network
          </button>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-green-700">
          About GrowLifeSuprimo
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          At GrowLifeSuprimo, we believe in nurturing people and possibilities.
          We are a next-generation MLM platform focused on sustainable business
          growth, financial literacy, and community building. Our mission is to
          turn effort into empowerment — one connection at a time.
        </p>
      </section>

      {/* MLM OPPORTUNITY SECTION */}
      <section className="bg-white py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">
          How It Works 🌿
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-green-50">
            <h3 className="font-bold text-xl mb-3 text-green-700">
              1️⃣ Join the Family
            </h3>
            <p>
              Register with GrowLifeSuprimo and access personalized tools to
              start your journey as a partner.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-green-50">
            <h3 className="font-bold text-xl mb-3 text-green-700">
              2️⃣ Build Your Network
            </h3>
            <p>
              Invite new members, expand your team, and unlock new levels of
              earning through smart referrals.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-green-50">
            <h3 className="font-bold text-xl mb-3 text-green-700">
              3️⃣ Grow & Earn
            </h3>
            <p>
              Watch your income grow as your team flourishes — earn passive
              rewards and leadership bonuses.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 bg-gradient-to-r from-green-100 via-white to-emerald-100 text-center">
        <h2 className="text-3xl font-bold mb-10 text-green-700">
          Meet Our Leaders
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {leaders.map((leader, i) => (
            <div
              key={i}
              className="w-64 bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={leader.img}
                alt={leader.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-green-700">
                  {leader.name}
                </h3>
                <p className="text-gray-500 text-sm">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold text-green-700 mb-8">
          What Our Members Say
        </h2>
        <div className="max-w-2xl mx-auto relative">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === i ? "opacity-100" : "opacity-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === i ? 1 : 0 }}
            >
              <div className="shadow-md p-8 rounded-xl bg-green-50">
                <p className="text-lg italic text-gray-700 mb-4">
                  “{t.feedback}”
                </p>
                <h3 className="font-bold text-green-700">{t.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 w-3 rounded-full ${
                index === i ? "bg-green-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Start Growing With GrowLifeSuprimo 🌱
        </h2>
        <p className="mb-6 text-lg">
          Be part of a movement that values growth, integrity, and teamwork.
        </p>
        <button className="bg-white text-green-700 hover:bg-gray-100 text-lg px-6 py-3 rounded-full shadow-lg">
          Become a Partner
        </button>
      </section>

      {/* FOOTER */}
      
    </div>
  );
}
