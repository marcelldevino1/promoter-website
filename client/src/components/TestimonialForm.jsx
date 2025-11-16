import { useState } from "react";
import Swal from "sweetalert2";

export default function TestimonialForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [username, setUsername] = useState("");
  const [serverName, setServerName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !serverName || !text) {
      Swal.fire({
        icon: "warning",
        title: "Form belum lengkap!",
        text: "Harap isi semua field sebelum mengirim testimoni.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const newTestimonial = {
      username,
      serverName,
      text,
      rating,
    };

    onSubmit(newTestimonial);

    Swal.fire({
      icon: "success",
      title: "Terima kasih!",
      text: "Testimoni kamu berhasil dikirim 🎉",
      confirmButtonColor: "#f97316",
    });

    setUsername("");
    setServerName("");
    setText("");
    setRating(5);
  };

  return (
    <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-[#111] border border-[#222] rounded-2xl p-8 shadow-lg">

      <h3 className="text-2xl font-bold text-orange-400 mb-4 text-center">
        Berikan Komentar Kamu
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-gray-300 mb-2">Rating:</label>
          <div className="flex gap-2 justify-left">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                onClick={() => setRating(i + 1)}
                className={`cursor-pointer text-2xl ${
                  i < rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-300 mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#222] text-white p-3 rounded-lg"
            placeholder="Masukkan username kamu..."
          />
        </div>

        {/* Nama Server */}
        <div>
          <label className="block text-gray-300 mb-1">Nama Server:</label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full bg-[#222] text-white p-3 rounded-lg"
            placeholder="Masukkan nama server kamu..."
          />
        </div>

        {/* Komentar */}
        <div>
          <label className="block text-gray-300 mb-1">Komentar:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-[#222] text-white p-3 rounded-lg"
            placeholder="Tulis pendapat kamu..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold hover:opacity-90"
        >
          Kirim Testimoni
        </button>
      </form>
    </div>
  );
}
