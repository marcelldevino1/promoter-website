import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // ✅ ikon checklist

export default function PackageSection() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  // Ambil data dari localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("packages"));
    if (stored && stored.length > 0) {
      setPackages(stored);
    } else {
      setPackages([
        {
          id: 1,
          name: "Paket A",
          description:
            "Cocok untuk pemula yang ingin memulai promosi dengan biaya terjangkau.",
          benefits: [
            "1x Video Promosi YouTube",
            "Promosi 24 Jam",
            "Statistik Penayangan",
          ],
          price: 20000,
        },
        {
          id: 2,
          name: "Paket B",
          description:
            "Pilihan ideal untuk memperluas jangkauan audiens dengan konten beragam.",
          benefits: [
            "2x Video + 1x Story Post",
            "Analisis Penayangan Mingguan",
            "Support via WhatsApp",
          ],
          price: 50000,
        },
        {
          id: 3,
          name: "Paket C",
          description:
            "Paket premium dengan performa promosi maksimal dan analitik lengkap.",
          benefits: [
            "3x Video + 2x Story Post",
            "Promosi 7 Hari",
            "Laporan Insight Detail",
            "Prioritas Support",
          ],
          price: 100000,
        },
      ]);
    }
  }, []);

  const handleSelect = (pkgName) => {
    navigate(`/order?package=${pkgName}`);
  };

  return (
    <section
      id="packages"
      className="py-24 text-center bg-gradient-to-b from-[#111] to-black"
    >
      <h2 className="text-4xl font-bold mb-12">
        Pilih  <span className="text-orange-400">Paket Sekarang</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="p-8 bg-[#111] rounded-2xl border border-[#222] hover:shadow-[0_0_30px_rgba(255,120,0,0.4)] transition relative text-left flex flex-col justify-between"
          >
            {/* 🖼️ Gambar Preview */}
            {pkg.image && (
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-40 object-cover rounded-xl mb-4 border border-[#222]"
              />
            )}

            {/* Nama paket */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="text-xl font-bold text-orange-400">{pkg.name}</h3>
              </div>

              {/* Harga */}
              <p className="text-3xl font-bold text-white mb-2">
                Rp {Number(pkg.price).toLocaleString("id-ID")}
              </p>

              {/* Deskripsi */}
              <p className="text-gray-400 text-sm mb-5">{pkg.description}</p>

              {/* Benefit list */}
              <ul className="space-y-2 mb-8">
                {(Array.isArray(pkg.benefits)
                  ? pkg.benefits
                  : pkg.benefits.split(",")
                ).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 size={16} className="text-orange-400 mt-0.5" />
                    <span>{benefit.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol */}
            <button
              onClick={() => handleSelect(pkg.name)}
              className="w-full py-3 mt-auto rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition font-semibold text-center"
            >
              Pilih Paket
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
