import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/AdminSidebar";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) navigate("/admin/login");
    fetchOrders();
  }, [navigate]);

  // 🔁 Ambil semua orders dari backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Gagal mengambil data orders:", err);
    }
  };

  // 🟢 Update status order
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status: newStatus,
      });
      console.log("✅ UPDATE STATUS:", res.data);

      Swal.fire({
        icon: "success",
        title: "Status Diperbarui!",
        text: `Status order telah diubah menjadi ${newStatus}.`,
        confirmButtonColor: "#f97316",
      });

      fetchOrders();
    } catch (err) {
      console.error("❌ Gagal update status:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Status",
        text: "Terjadi kesalahan saat memperbarui status order.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // 🗑️ Hapus order (dengan konfirmasi)
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus order ini?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Order telah dihapus.",
        confirmButtonColor: "#f97316",
      });

      fetchOrders();
    } catch (err) {
      console.error("❌ Gagal menghapus order:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Order",
        text: "Terjadi kesalahan saat menghapus order.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // 🧭 Filter status order
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000] overflow-x-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-8">Orders</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {["All", "Pending", "Ongoing", "Done"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-full border ${
                filter === status
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-[#1c1c1c] text-gray-300 hover:text-orange-400"
              } transition`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto bg-[#111] p-6 rounded-2xl border border-[#222] shadow-lg">
          <table className="w-full border-collapse text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-[#1a1a1a] text-orange-400">
                <th className="p-3">Server Name</th>
                <th className="p-3">Package</th>
                <th className="p-3">Daily / Highest</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Link Group</th>
                <th className="p-3">Discord</th>
                <th className="p-3">All Host</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#333] hover:bg-[#1c1c1c] transition"
                  >
                    <td className="p-3">{order.serverName}</td>
                    <td className="p-3">{order.package}</td>
                    <td className="p-3">
                      {order.dailyOn} / {order.highestOn}
                    </td>
                    <td className="p-3">{order.whatsapp}</td>
                    <td className="p-3">{order.paymentMethod}</td>

                    <td className="p-3">
                      {order.linkGroupWA ? (
                        <a
                          href={order.linkGroupWA}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      {order.linkDiscord ? (
                        <a
                          href={order.linkDiscord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      {order.linkAllHost ? (
                        <a
                          href={order.linkAllHost}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-[#222] text-white rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
