import { motion } from "framer-motion";

export default function FeatureSection() {
  const features = [
    {
      title: "Promosi Instan & Mudah",
      desc: "Cukup isi form, pilih paket promosi, dan tim kami langsung bantu servermu jadi ramai tanpa ribet!",
      icon: "",
    },
    {
      title: "Promoter Berpengalaman",
      desc: "kami sudah berpengalaman membantu ratusan server GTPS berkembang dengan cara yang efektif.",
      icon: "",
    },
    {
      title: "Paket Promosi Sesuai Budget",
      desc: "Dari Murah sampai mahal, tersedia berbagai pilihan paket agar kamu bisa mulai promosi sesuai kebutuhanmu.",
      icon: "",
    },
  ];

  return (
    <section className="text-white py-16 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-400">
          Kenapa Harus Promosi di Sini?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a1a] p-6 rounded-2xl shadow-[0_0_20px_rgba(255,120,0,0.3)] hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-orange-300">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
