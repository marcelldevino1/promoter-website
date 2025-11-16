import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar";

export default function SetNumberPage() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Cek login admin dan ambil nomor WhatsApp
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) navigate("/admin/login");

    const fetchNumber = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/number");
        setNumber(res.data.whatsappNumber || "");
      } catch (err) {
        console.error("❌ Error fetching admin number:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Tidak dapat mengambil nomor admin dari server.",
          confirmButtonColor: "#f97316",
        });
      }
    };

    fetchNumber();
  }, [navigate]);

  // 🧾 Simpan nomor admin ke database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!number.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nomor Kosong!",
        text: "Masukkan nomor WhatsApp admin terlebih dahulu.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    setLoading(true);
    Swal.fire({
      title: "Menyimpan Nomor...",
      text: "Harap tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await axios.post("http://localhost:5000/api/admin/number", {
        whatsappNumber: number,
      });

      Swal.close();

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Nomor admin berhasil disimpan.",
          confirmButtonColor: "#f97316",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: "Terjadi kesalahan di server.",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      Swal.close();
      console.error("❌ Error saving admin number:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Tidak dapat terhubung ke server. Pastikan server aktif.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000]">
        <h1 className="text-3xl font-bold text-orange-400 mb-8 text-center md:text-left">
          Set Nomor WhatsApp Admin
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111] p-8 rounded-2xl border border-[#222] shadow-lg max-w-md mx-auto"
        >
          <label className="block mb-3 text-gray-300">
            Nomor WhatsApp Admin (format: 62...)
          </label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#222] text-white mb-6"
            placeholder="Contoh: 6283171716843"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Nomor"}
          </button>
        </form>
      </main>
    </div>
  );
}
