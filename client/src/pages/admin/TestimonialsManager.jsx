import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar"; // ✅ Gunakan sidebar responsif kamu

export default function TestimonialsManager() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);

  // 🔒 Cek login dan ambil data aman dari localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) {
      navigate("/admin/login");
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem("userTestimonials")) || [];
      if (Array.isArray(stored)) setTestimonials(stored);
      else setTestimonials([]);
    } catch (err) {
      console.error("❌ Gagal parse testimonials:", err);
      setTestimonials([]);
    }
  }, [navigate]);

  // 🗑️ Hapus 1 testimoni
  const handleDelete = async (index) => {
    const confirm = await Swal.fire({
      title: "Hapus testimoni ini?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
    localStorage.setItem("userTestimonials", JSON.stringify(updated));

    Swal.fire({
      icon: "success",
      title: "Testimoni dihapus!",
      confirmButtonColor: "#f97316",
    });
  };

  // 🧹 Hapus semua testimoni
  const handleClearAll = async () => {
    const confirm = await Swal.fire({
      title: "Hapus semua testimoni?",
      text: "Semua data testimoni user akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus semua",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    localStorage.removeItem("userTestimonials");
    setTestimonials([]);

    Swal.fire({
      icon: "success",
      title: "Semua testimoni dihapus!",
      confirmButtonColor: "#f97316",
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <AdminSidebar /> {/* ✅ Sidebar responsif kamu */}

      <main className="flex-1 p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000] overflow-y-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-8">Kelola Testimoni</h1>

        {testimonials.length === 0 ? (
          <p className="text-gray-400">Belum ada testimoni dari user.</p>
        ) : (
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-lg overflow-x-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                🧹 Hapus Semua
              </button>
            </div>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-orange-400">
                  <th className="p-3">Username</th>
                  <th className="p-3">Nama Server</th>
                  <th className="p-3">Komentar</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t, i) => (
                  <tr key={i} className="border-b border-[#333] hover:bg-[#1c1c1c] transition">
                    <td className="p-3 font-semibold">{t.username}</td>
                    <td className="p-3 text-gray-400">{t.serverName}</td>
                    <td className="p-3 text-gray-300">{t.text}</td>
                    <td className="p-3 text-yellow-400">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(i)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
