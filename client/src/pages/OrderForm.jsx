import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // 💡 Tambah SweetAlert2

export default function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const packageType = params.get("package");

  const [formData, setFormData] = useState({
    serverName: "",
    features: "",
    dailyOn: "",
    highestOn: "",
    serverType: "Fresh Server",
    whatsapp: "",
    payment: "Gopay",
    linkGroupWA: "",
    linkDiscord: "",
    linkAllHost: "",
  });

  const [adminNumber, setAdminNumber] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Ambil nomor WhatsApp admin dari backend saat halaman dimuat
  useEffect(() => {
    const fetchAdminNumber = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/number");
        if (res.data && res.data.whatsappNumber) {
          setAdminNumber(res.data.whatsappNumber);
        } else {
          console.warn("⚠️ Nomor admin belum diset di database.");
        }
      } catch (err) {
        console.error("❌ Gagal mengambil nomor admin:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat",
          text: "Tidak dapat mengambil nomor admin dari server.",
          confirmButtonColor: "#f97316",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAdminNumber();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.linkAllHost.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Link All Host Kosong!",
        text: "Mohon isi Link All Host sebelum melanjutkan.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    if (!adminNumber) {
      Swal.fire({
        icon: "error",
        title: "Nomor Admin Belum Diset",
        text: "Silakan hubungi administrator.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: `Konfirmasi Pembelian`,
      html: `Kamu akan membeli paket <b>${packageType}</b>.<br/>Klik <b>Ya</b> untuk lanjut ke WhatsApp.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) {
      Swal.fire({
        icon: "info",
        title: "Pembelian Dibatalkan",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/", { state: { message: "Pembelian Dibatalkan" } });
      return;
    }

    try {
      // 🔄 Tampilkan loading
      Swal.fire({
        title: "Membuat Pesanan...",
        text: "Harap tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          serverName: formData.serverName,
          fitur: formData.features,
          logoUrl: "",
          dailyOn: formData.dailyOn,
          highestOn: formData.highestOn,
          statusServer: formData.serverType,
          whatsapp: formData.whatsapp,
          paymentMethod: formData.payment,
          package: packageType,
          linkGroupWA: formData.linkGroupWA,
          linkDiscord: formData.linkDiscord,
          linkAllHost: formData.linkAllHost,
          status: "Pending",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.close();

      if (res.status === 201) {
        // 🟢 Kirim pesan ke WhatsApp admin
        const text = `
Halo Admin 👋
Saya ingin membeli paket *${packageType}*.

📛 Server Name: ${formData.serverName}
⚙️ Fitur: ${formData.features}
📈 Daily On: ${formData.dailyOn}
🔥 Highest On: ${formData.highestOn}
💬 WhatsApp: ${formData.whatsapp}
💳 Pembayaran: ${formData.payment}
🔗 Group WA: ${formData.linkGroupWA || "-"}
🎮 Discord: ${formData.linkDiscord || "-"}
🌍 All Host: ${formData.linkAllHost}
`;

        const whatsappURL = `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappURL, "_blank");

        Swal.fire({
          icon: "success",
          title: "Pembelian Berhasil!",
          text: "Silakan tunggu konfirmasi dari admin.",
          confirmButtonColor: "#f97316",
        });

        navigate("/", {
          state: {
            message: "Pembelian Berhasil! Silakan tunggu konfirmasi admin.",
          },
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Terjadi Kesalahan",
          text: "Respon server tidak sesuai. Coba lagi nanti.",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      Swal.close();
      console.error("❌ Error creating order:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Pesanan",
        text: "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi nanti.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black text-white p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_rgba(255,120,0,0.4)] w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">
          Form Pemesanan Paket {packageType ? packageType : ""}
        </h2>

        <input
          type="text"
          name="serverName"
          placeholder="Nama Server"
          onChange={handleChange}
          required
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />

        <textarea
          name="features"
          placeholder="Keunggulan Fitur"
          rows="3"
          onChange={handleChange}
          required
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        ></textarea>

        <div className="flex gap-4 mb-4">
          <input
            type="number"
            name="dailyOn"
            placeholder="Daily On"
            onChange={handleChange}
            required
            className="w-1/2 p-3 rounded bg-[#222] text-white"
          />
          <input
            type="number"
            name="highestOn"
            placeholder="Highest On"
            onChange={handleChange}
            required
            className="w-1/2 p-3 rounded bg-[#222] text-white"
          />
        </div>

        <select
          name="serverType"
          onChange={handleChange}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        >
          <option value="Fresh Server">Fresh Server</option>
          <option value="Old Server">Old Server</option>
        </select>

        <input
          type="text"
          name="whatsapp"
          placeholder="Nomor WhatsApp Kamu"
          onChange={handleChange}
          required
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />

        <select
          name="payment"
          onChange={handleChange}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        >
          <option value="Gopay">Gopay</option>
          <option value="Dana">Dana</option>
          <option value="Ovo">Ovo</option>
        </select>

        <input
          type="text"
          name="linkGroupWA"
          placeholder="Link Group WhatsApp (Opsional)"
          onChange={handleChange}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />
        <input
          type="text"
          name="linkDiscord"
          placeholder="Link Discord (Opsional)"
          onChange={handleChange}
          className="w-full p-3 rounded mb-4 bg-[#222] text-white"
        />
        <input
          type="text"
          name="linkAllHost"
          placeholder="Link All Host (Wajib)"
          onChange={handleChange}
          required
          className="w-full p-3 rounded mb-6 bg-[#222] text-white"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition font-semibold"
        >
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
}
