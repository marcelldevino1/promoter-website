import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrderNotif, setNewOrderNotif] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [packages, setPackages] = useState([]);

  // 🔒 Proteksi route
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInAdmin");
    if (!loggedIn) navigate("/admin/login");

    const storedPackages = JSON.parse(localStorage.getItem("packages")) || [];
    setPackages(storedPackages);
  }, [navigate]);

  // 🧠 Ambil data order dari Firestore (via backend)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");

        // 🔄 Konversi Firestore timestamp ke Date
        const formatted = res.data.map((o) => {
          let createdAt = o.createdAt;
          if (createdAt?.seconds) createdAt = new Date(createdAt.seconds * 1000);
          else if (typeof createdAt === "string") createdAt = new Date(createdAt);
          else createdAt = new Date();

          return { ...o, createdAt };
        });

        setOrders(formatted);
      } catch (err) {
        console.error("❌ Gagal mengambil data orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // 📈 Statistik order
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const ongoing = orders.filter((o) => o.status === "Ongoing").length;
  const done = orders.filter((o) => o.status === "Done").length;

  // 🧮 Tahun unik dari data Firestore
  const availableYears = [
    ...new Set(
      orders.map((o) =>
        o.createdAt instanceof Date
          ? o.createdAt.getFullYear()
          : new Date().getFullYear()
      )
    ),
  ].sort((a, b) => b - a);

  // 📊 Buat data chart per bulan berdasarkan tahun terpilih
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData = months.map((month, index) => {
    const ordersInMonth = orders.filter(
      (o) =>
        o.createdAt instanceof Date &&
        o.createdAt.getMonth() === index &&
        o.createdAt.getFullYear() === selectedYear
    );
    return { month, orders: ordersInMonth.length };
  });

  // Filter order per bulan yang diklik
  const filteredOrders = selectedMonth
    ? orders.filter(
        (o) =>
          o.createdAt instanceof Date &&
          o.createdAt.getMonth() === months.indexOf(selectedMonth) &&
          o.createdAt.getFullYear() === selectedYear
      )
    : [];

  // 🗑️ Hapus gambar paket (localStorage)
  const handleRemoveImage = (index) => {
    const updated = [...packages];
    updated[index].image = "";
    setPackages(updated);
    localStorage.setItem("packages", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white relative">
      {/* Sidebar Responsif */}
      <AdminSidebar />

      {/* Main Dashboard */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black via-[#1a0f00] to-[#220000] overflow-y-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-8">
          Dashboard Overview
        </h1>

        {/* 📅 Filter Tahun */}
        <div className="mb-6 flex justify-end">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#1a1a1a] text-white border border-[#333] px-4 py-2 rounded-lg"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* 📦 Active Packages */}
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] mb-10">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">
            📦 Active Packages
          </h2>
          {packages.length === 0 ? (
            <p className="text-gray-400">Belum ada paket tersedia.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {packages.map((pkg, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-orange-500 transition relative"
                >
                  {pkg.image && (
                    <div className="relative mb-3">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-32 object-cover rounded-md border border-[#333]"
                      />
                      <button
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded-md font-semibold"
                      >
                        🗑️
                      </button>
                    </div>
                  )}

                  <h3 className="text-orange-400 font-bold text-lg">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {Array.isArray(pkg.benefits)
                      ? pkg.benefits.join(", ")
                      : pkg.benefits}
                  </p>
                  <p className="text-green-400 font-semibold">
                    Rp {Number(pkg.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Orders" value={totalOrders} color="text-orange-400" />
          <StatCard label="Pending" value={pending} color="text-yellow-400" />
          <StatCard label="Ongoing" value={ongoing} color="text-blue-400" />
          <StatCard label="Done" value={done} color="text-green-400" />
        </div>

        {/* 📊 Grafik Orders per Bulan */}
        <div className="bg-[#111] p-8 rounded-2xl border border-[#222] shadow-lg mb-10">
          <h2 className="text-xl font-semibold text-orange-400 mb-6">
            Total Orders per Month ({selectedYear})
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              onClick={(data) => {
                if (data?.activeLabel) setSelectedMonth(data.activeLabel);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1c1c",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <Bar dataKey="orders" fill="#ff6b00" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📋 Daftar Order Berdasarkan Bulan */}
        {selectedMonth && (
          <MonthOrderList
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            filteredOrders={filteredOrders}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </main>
    </div>
  );
}

// 🔸 Komponen Kartu Statistik
function StatCard({ label, value, color }) {
  return (
    <div className="p-6 rounded-xl bg-[#111] border border-[#222] text-center">
      <h3 className="text-gray-400 text-sm">{label}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

// 🔸 Komponen Daftar Order per Bulan
function MonthOrderList({ selectedMonth, selectedYear, filteredOrders, setSelectedMonth }) {
  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-[#222] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-orange-400">
          Orders in {selectedMonth} {selectedYear}
        </h3>
        <button
          onClick={() => setSelectedMonth(null)}
          className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Close
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1a1a1a] text-orange-400">
              <th className="p-3">Server Name</th>
              <th className="p-3">Package</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, i) => (
              <tr
                key={order.id || i}
                className="border-b border-[#333] hover:bg-[#1c1c1c] transition"
              >
                <td className="p-3">{order.serverName}</td>
                <td className="p-3">{order.package}</td>
                <td className="p-3">{order.whatsapp}</td>
                <td className="p-3 text-yellow-400">{order.status}</td>
                <td className="p-3">
                  {order.createdAt.toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-center py-4">
          Tidak ada order di bulan ini.
        </p>
      )}
    </div>
  );
}
