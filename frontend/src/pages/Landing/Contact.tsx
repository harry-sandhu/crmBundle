
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 text-center">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          Contact GrowLifeSuprimo 🌱
        </h2>
        <p className="text-gray-700 text-lg mb-10">
          Have questions, suggestions, or partnership inquiries?  
          We’d love to hear from you!
        </p>

        {/* Contact Info */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
          <ul className="text-gray-700 text-lg space-y-3">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:growlifesupremo2025@gmail.com"
                className="text-green-600 hover:underline"
              >
                growlifesupremo2025@gmail.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+919876543210"
                className="text-green-600 hover:underline"
              >
                +91 98765 43210
              </a>
            </li>
            <li>
              <strong>Address:</strong> Hyderabad, Telangana, India
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-left text-gray-700 font-semibold mb-2"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-left text-gray-700 font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-left text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg shadow-md transition"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
}
