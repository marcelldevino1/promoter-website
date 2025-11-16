import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

export default function BrandSetting() {
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState("");

  // 🔒 Cek login admin
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) navigate("/admin/login");

    const savedBrand = localStorage.getItem("brandSettings");
    if (savedBrand) {
      const { name, logo } = JSON.parse(savedBrand);
      setBrandName(name || "");
      setLogo(logo || "");
    }
  }, [navigate]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!brandName) {
      Swal.fire("⚠️", "Nama brand tidak boleh kosong!", "warning");
      return;
    }
    localStorage.setItem("brandSettings", JSON.stringify({ name: brandName, logo }));
    Swal.fire("✅", "Brand berhasil disimpan!", "success");
  };

  const handleReset = () => {
    localStorage.removeItem("brandSettings");
    setBrandName("");
    setLogo("");
    Swal.fire("♻️", "Brand berhasil direset ke default!", "info");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000] flex justify-center items-start">
        <div className="bg-[#111] p-8 rounded-2xl border border-[#222] shadow-lg w-full max-w-md text-center mt-8">
          <h1 className="text-3xl font-bold mb-6 text-orange-400">
            Brand Settings
          </h1>

          <label className="block text-left mb-2 text-gray-300">
            Nama Brand:
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#222] text-white mb-4"
            placeholder="Masukkan nama brand..."
          />

          <label className="block text-left mb-2 text-gray-300">
            Logo Brand:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full mb-4 text-gray-300"
          />

          {logo && (
            <div className="mb-4 flex justify-center">
              <img
                src={logo}
                alt="Preview"
                className="w-24 h-24 rounded-lg border border-gray-600 object-contain"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold hover:opacity-90"
            >
              Simpan
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2 bg-gray-600 rounded-lg font-semibold hover:opacity-80"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
