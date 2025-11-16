import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Set Package", path: "/admin/packages" },
    { name: "Set Number", path: "/admin/setnumber" },
    { name: "Brand Setting", path: "/admin/brandsetting" },
    { name: "Testimonials", path: "/admin/testimonials" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Overlay untuk HP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#222]">
            <div>
              <h1 className="text-2xl font-bold text-orange-400">
                PromoterPanel
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <button
              className="md:hidden text-gray-300 hover:text-orange-400"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mt-6 flex flex-col space-y-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#1e1e1e]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Tombol buka sidebar di HP */}
      <button
        className="fixed top-5 left-5 md:hidden z-50 bg-[#1a1a1a] border border-[#333] rounded-lg p-2 hover:bg-[#222] transition"
        onClick={() => setOpen(true)}
      >
        <Menu size={22} className="text-orange-400" />
      </button>
    </>
  );
}
