import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0b0b] border-t border-[#222] py-16 text-center overflow-hidden">
      {/* background glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,120,0,0.15),transparent_70%)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
        }}
      />

      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          PromoterPanel
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          © {new Date().getFullYear()} PromoterPanel. All rights reserved.
        </p>
        <div className="flex justify-center gap-8 text-gray-400 text-sm">
          <a href="#features" className="hover:text-orange-400 transition">
            Features
          </a>
          <a href="#packages" className="hover:text-orange-400 transition">
            Packages
          </a>
          <a href="#testimonials" className="hover:text-orange-400 transition">
            Testimonials
          </a>
        </div>
      </div>
    </footer>
  );
}
