import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire("⚠️", "Isi email dan password terlebih dahulu!", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        Swal.fire("✅", "Login berhasil!", "success");
        localStorage.setItem("loggedInAdmin", true);
        localStorage.setItem("adminEmail", form.email);
        navigate("/admin");
      } else {
        Swal.fire("❌", res.data.message, "error");
      }
    } catch (err) {
      console.error("Login error:", err);
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
        onSubmit={handleLogin}
        className="bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_rgba(255,120,0,0.4)] w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">
          Admin Login
        </h2>

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
          className="w-full p-3 rounded mb-6 bg-[#222] text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 font-semibold ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Memeriksa..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          Belum punya akun?{" "}
          <span
            className="text-orange-400 cursor-pointer"
            onClick={() => navigate("/admin/register")}
          >
            Daftar di sini
          </span>
        </p>
      </form>
    </div>
  );
}
