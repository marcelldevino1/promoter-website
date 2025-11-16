import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import TestimonialForm from "./TestimonialForm";

export default function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const controls = useAnimation();
  const [testimonials, setTestimonials] = useState([]);

  // 🔁 Auto-scroll animation
  useEffect(() => {
    if (paused) {
      controls.stop();
    } else {
      controls.start({
        x: ["0%", "-100%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        },
      });
    }
  }, [paused, controls]);

  // 🔄 Ambil testimoni dari localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userTestimonials")) || [];
    setTestimonials(stored);
  }, []);

  // 🧩 Tambah testimoni baru
  const handleAddTestimonial = (newTestimonial) => {
    const updated = [...testimonials, newTestimonial];
    setTestimonials(updated);
    localStorage.setItem("userTestimonials", JSON.stringify(updated));
  };

  // ⚙️ Tentukan apakah perlu looping (kalau lebih dari 3 testimoni)
  const displayedTestimonials =
    testimonials.length > 3 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <section
      id="testimonials"
      className="relative py-32 bg-[#0e0e0e] overflow-hidden"
    >
      {/* 🔥 Animated Background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(27,27,27,0.4),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(255, 153, 0, 1),transparent_70%)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      />

      {/* Title */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Apa yang <span className="text-orange-400">Orang katakan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Bagikan pengalamanmu menggunakan layanan kami.
        </motion.p>
      </div>

      {/* ✨ Render kondisi terpisah */}
      {testimonials.length > 0 ? (
        <div
          className="relative overflow-hidden cursor-grab mb-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex gap-8 w-max"
            animate={controls}
            initial={{ x: 0 }}
          >
            {displayedTestimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] bg-[#141414]/70 border border-[#222] rounded-2xl p-6 backdrop-blur-lg shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(255,120,0,0.3)] transition"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold border-2 border-orange-400">
                    {t.username ? t.username[0].toUpperCase() : "U"}
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-white">{t.username}</h3>
                    <p className="text-sm text-gray-400">{t.serverName}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{t.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        // 🧃 Jika belum ada komentar
        <div className="text-center text-gray-400 italic mb-16">
          Belum ada komentar
        </div>
      )}

      {/* Form Input Testimoni */}
      <div className="relative z-10">
        <TestimonialForm onSubmit={handleAddTestimonial} />
      </div>

      {/* Overlay gradient */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0e0e0e] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0e0e0e] to-transparent pointer-events-none" />
    </section>
  );
}
