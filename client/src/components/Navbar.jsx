import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [brand, setBrand] = useState({
    name: "neth.",
    logo: null,
  });

  // 🧭 Daftar menu
  const navLinks = ["Home", "Features", "Packages", "FAQ"];

  // 🧠 Ambil data brand dari localStorage
  useEffect(() => {
    const savedBrand = localStorage.getItem("brandSettings");
    if (savedBrand) {
      const { name, logo } = JSON.parse(savedBrand);
      setBrand({
        name: name || "NethGTPS",
        logo: logo || null,
      });
    }
  }, []);

  // 🌊 Fungsi scroll halus ke section
  const handleScroll = (id) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `#${id.toLowerCase()}`;
    }
  };

  // ⚡ Scroll ke Packages dari tombol
  const handleGetStarted = () => handleScroll("Packages");

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/40 border-b border-white/10 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand logo + name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleScroll("Home")}>
          {brand.logo && (
            <img
              src={brand.logo}
              alt="logo"
              className="w-10 h-10 object-contain rounded-full border border-gray-700"
            />
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
            {brand.name}
          </h1>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleScroll(link)}
              className="relative group hover:text-white transition"
            >
              {link}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </div>

        {/* Get Started button */}
        <button
          onClick={handleGetStarted}
          className="px-5 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full font-semibold hover:shadow-[0_0_15px_rgba(255,100,0,0.5)] transition"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}
