import express from "express";
import { db } from "../server.js";
import admin from "firebase-admin";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * 🟢 GET: Ambil nomor admin
 */
router.get("/number", async (req, res) => {
  try {
    const snapshot = await db.collection("adminSettings").limit(1).get();
    if (snapshot.empty) {
      return res.json({ whatsappNumber: "" });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("❌ Gagal ambil nomor admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🟡 POST / UPDATE: Simpan nomor admin
 */
router.post("/number", async (req, res) => {
  try {
    console.log("📩 Request Body Diterima:", req.body);

    if (!req.body.whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: "Nomor WhatsApp wajib diisi.",
      });
    }

    const { whatsappNumber } = req.body;
    const snapshot = await db.collection("adminSettings").limit(1).get();

    if (snapshot.empty) {
      const docRef = await db.collection("adminSettings").add({ whatsappNumber });
      console.log("✅ Nomor admin baru disimpan:", whatsappNumber);
      return res.status(201).json({
        success: true,
        whatsappNumber,
        message: "Nomor admin berhasil disimpan.",
        id: docRef.id,
      });
    } else {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ whatsappNumber });
      console.log("✅ Nomor admin diperbarui:", whatsappNumber);
      return res.json({
        success: true,
        whatsappNumber,
        message: "Nomor admin berhasil diperbarui.",
      });
    }
  } catch (err) {
  console.error("❌ Gagal register admin:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan tidak diketahui di server.",
  });
}
});

/**
 * 🟢 REGISTER ADMIN (pakai bcrypt)
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Semua field wajib diisi." });
    }

    // 🔍 Cek apakah email sudah terdaftar
    const existingAdmin = await db
      .collection("admins")
      .where("email", "==", email)
      .get();

    if (!existingAdmin.empty) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }

    // 🔐 Enkripsi password pakai bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 💾 Simpan admin baru ke Firestore
    await db.collection("admins").add({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log(`✅ Admin baru terdaftar: ${email}`);
    res.status(201).json({ success: true, message: "Admin berhasil didaftarkan." });
  } catch (err) {
    console.error("❌ Gagal register admin:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔑 LOGIN ADMIN (bcrypt compare)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email dan password wajib diisi." });
    }

    // 🔍 Cari admin berdasarkan email di Firestore
    const snapshot = await db
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Akun tidak ditemukan." });
    }

    const adminData = snapshot.docs[0].data();

    // 🔐 Bandingkan password input dengan hash di Firestore
    const isMatch = await bcrypt.compare(password, adminData.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Username atau password salah." });
    }

    console.log(`✅ Admin berhasil login: ${email}`);
    return res.json({
      success: true,
      message: "Login berhasil!",
      admin: {
        id: snapshot.docs[0].id,
        email: adminData.email,
        username: adminData.username,
      },
    });
  } catch (err) {
    console.error("❌ Gagal login admin:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + err.message,
    });
  }
});

export default router;