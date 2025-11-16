import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const packageId = params.get("package");

  const [status, setStatus] = useState("waiting"); // waiting | success
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "waiting") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handlePaymentSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  const handlePaymentSuccess = () => {
    // update status di localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length > 0) {
      orders[orders.length - 1].status = "Done";
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    setStatus("success");
  };

  const handleDone = () => {
    navigate("/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#000] text-white">
      <div className="bg-[#111] p-10 rounded-3xl shadow-[0_0_40px_rgba(255,120,0,0.4)] text-center w-[400px]">
        <h2 className="text-2xl font-bold text-orange-400 mb-6">
          Scan to Pay (GoPay)
        </h2>

        <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 bg-[#111] rounded-sm"></div>
        </div>

        {status === "waiting" ? (
          <>
            <p className="text-gray-300 mb-2">
              Waiting for payment confirmation...
            </p>
            <p className="text-gray-500 mb-6">
              Auto-confirm in {countdown}s
            </p>
            <button
              onClick={handleDone}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-full transition font-semibold"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="text-green-400 font-semibold mb-4">
              ✅ Payment Confirmed!
            </p>
            <button
              onClick={handleDone}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 px-6 py-2 rounded-full font-semibold transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
