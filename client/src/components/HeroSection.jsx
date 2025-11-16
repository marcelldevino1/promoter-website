import { motion } from "framer-motion";

export default function HeroSection() {
  const scrollToPackages = () => {
    document.getElementById("packages").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="Beranda"
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#0e0e0e] to-[#1a1a1a] text-white pt-24"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
      >
        Promosikan Server Anda <br />
        <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500 bg-clip-text text-transparent">
          Cepat & Terjamin
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-300 max-w-2xl mb-10"
      >
        Kembangkan server GTPS Anda lebih cepat dengan website   fleksibel kami.
      </motion.p>

      <motion.button
        onClick={scrollToPackages}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,120,0,0.5)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-lg shadow-lg"
      >
        Get Started
      </motion.button>
    </section>
  );
}
