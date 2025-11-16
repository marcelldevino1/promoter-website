import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🧩 Validasi dasar
    if (!form.username || !form.email || !form.password || !form.confirm) {
      Swal.fire("⚠️", "Semua field wajib diisi!", "warning");
      return;
    }
    if (form.password !== form.confirm) {
      Swal.fire("❌", "Password dan konfirmasi tidak cocok!", "error");
      return;
    }

    setLoading(true);
    try {
      // 🧾 Kirim data ke backend
      const res = await axios.post("http://localhost:5000/api/admin/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        Swal.fire("✅", "Pendaftaran berhasil! Silakan login.", "success");
        navigate("/admin/login");
      } else {
        Swal.fire("⚠️", res.data.message || "Gagal mendaftar.", "warning");
      }
    } catch (err) {
      console.error("❌ Error register:", err);
      Swal.fire(
        "❌",
        err.response?.data?.message || "Terjadi kesalahan server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_rgba(255,120,0,0.4)] w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">
          Daftar Admin
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full p-3 rounded mb-6 bg-[#222] text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 font-semibold ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <span
            className="text-orange-400 cursor-pointer"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
