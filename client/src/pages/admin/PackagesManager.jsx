import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";

export default function PackagesManager() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    benefits: [""],
    price: "",
    image: "",
  });

  // 🔒 Cek login admin & ambil data paket dari localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) navigate("/admin/login");

    const stored = JSON.parse(localStorage.getItem("packages")) || [];
    setPackages(stored);
  }, [navigate]);

  // 💾 Simpan data ke localStorage + SweetAlert sukses
  const savePackages = (updated, message) => {
    setPackages(updated);
    localStorage.setItem("packages", JSON.stringify(updated));
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: message,
      confirmButtonColor: "#f97316",
    });
  };

  // 🔧 Handler Input Form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) =>
        setFormData((prev) => ({ ...prev, image: event.target.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  // ➕ Tambah Paket Baru
  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      Swal.fire({
        icon: "warning",
        title: "Harap Lengkapi!",
        text: "Nama paket dan harga wajib diisi.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const updated = [...packages, { ...formData, id: Date.now() }];
    savePackages(updated, "Paket baru berhasil ditambahkan!");
    setFormData({ name: "", benefits: [""], price: "", image: "" });
  };

  // ✏️ Edit Paket
  const handleEdit = (index) => {
    setEditingIndex(index);
    const pkg = packages[index];
    setFormData({
      ...pkg,
      benefits:
        typeof pkg.benefits === "string"
          ? pkg.benefits.split(",").map((b) => b.trim())
          : pkg.benefits,
    });
  };

  // 💾 Simpan Perubahan Paket
  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = [...packages];
    updated[editingIndex] = { ...formData };
    savePackages(updated, "Paket berhasil diperbarui!");
    setEditingIndex(null);
    setFormData({ name: "", benefits: [""], price: "", image: "" });
  };

  // 🗑️ Hapus Paket dengan Konfirmasi SweetAlert
  const handleDelete = async (index) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus paket ini?",
      text: "Data paket akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    const updated = packages.filter((_, i) => i !== index);
    savePackages(updated, "Paket berhasil dihapus!");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000] overflow-y-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center md:text-left">
          Manage Packages
        </h1>

        {/* 🧾 Form Tambah/Edit Paket */}
        <form
          onSubmit={editingIndex !== null ? handleUpdate : handleAdd}
          className="bg-[#111] p-6 rounded-2xl border border-[#222] mb-10 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Paket"
              value={formData.name}
              onChange={handleChange}
              className="p-3 bg-[#222] rounded-lg text-white"
            />
            <input
              type="number"
              name="price"
              placeholder="Harga (Rp)"
              value={formData.price}
              onChange={handleChange}
              className="p-3 bg-[#222] rounded-lg text-white"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="p-2 bg-[#222] rounded-lg text-gray-300"
            />
          </div>

          {/* 📸 Preview Gambar */}
          {formData.image && (
            <div className="mt-4 flex flex-col items-center relative w-fit mx-auto">
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-[#333] shadow-md"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                className="mt-2 text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
              >
                🗑️ Hapus Foto
              </button>
            </div>
          )}

          {/* 📋 Daftar Benefit */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-400 mb-2">Daftar Benefit:</h3>
            {formData.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(i, e.target.value)}
                  placeholder={`Benefit ${i + 1}`}
                  className="flex-1 p-3 bg-[#222] rounded-lg text-white"
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(i)}
                  className="px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBenefit}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              + Tambah Benefit
            </button>
          </div>

          {/* 💾 Tombol Simpan */}
          <button
            type="submit"
            className="mt-6 py-3 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition font-semibold w-full md:w-auto"
          >
            {editingIndex !== null ? "Simpan Perubahan" : "Tambah Paket"}
          </button>
        </form>

        {/* 📦 Daftar Paket */}
        <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-lg overflow-x-auto max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-orange-400 mb-4 text-center md:text-left">
            Daftar Paket Promosi
          </h2>
          {packages.length === 0 ? (
            <p className="text-gray-400 text-center">
              Belum ada paket ditambahkan.
            </p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#1a1a1a] text-orange-400">
                  <th className="p-3">Preview</th>
                  <th className="p-3">Nama Paket</th>
                  <th className="p-3">Benefit</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#333] hover:bg-[#1c1c1c] transition"
                  >
                    <td className="p-3">
                      {pkg.image ? (
                        <img
                          src={pkg.image}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 font-semibold text-orange-300">
                      {pkg.name}
                    </td>
                    <td className="p-3">
                      <ul className="list-disc pl-5">
                        {(Array.isArray(pkg.benefits)
                          ? pkg.benefits
                          : pkg.benefits.split(",")
                        ).map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-green-400">
                      Rp {Number(pkg.price).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleEdit(i)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(i)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
