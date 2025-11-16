import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Apa itu layanan promosi server GTPS?",
      answer:
        "Layanan ini membantu kamu mempromosikan server Growtopia Private Server (GTPS) supaya makin dikenal, ramai pemain, dan berkembang lebih cepat.",
    },
    {
      question: "Apakah saya bisa memilih paket promosi sesuai kebutuhan?",
      answer:
        "Ya, tentu! Kami menyediakan berbagai paket — dari paket murah hingga mahal untuk hasil promosi maksimal.",
    },
    {
      question: "Apakah promosi bisa dibatalkan atau di-refund?",
      answer:
        "Kami tidak menyediakan refund setelah promosi berjalan. Namun, jika ada kesalahan teknis dari pihak kami, promosi akan dijadwalkan ulang secara gratis.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-orange-400">
          Pertanyaan yang Sering Diajukan
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a1a] p-5 rounded-xl shadow-[0_0_15px_rgba(255,120,0,0.2)]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-lg font-medium text-orange-300">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-300 mt-3 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
