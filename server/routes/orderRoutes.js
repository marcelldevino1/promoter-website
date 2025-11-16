import express from "express";
import { db } from "../server.js";

const router = express.Router();

/**
 * 🟢 POST: Buat order baru
 */
router.post("/", async (req, res) => {
  try {
    console.log("📥 Data order diterima:", req.body);

    // Validasi sederhana
    if (!req.body.serverName || !req.body.package) {
      return res.status(400).json({
        success: false,
        message: "Server name dan package wajib diisi.",
      });
    }

    // Simpan ke Firestore
    const newOrder = {
      serverName: req.body.serverName,
      fitur: req.body.fitur || req.body.features || "-",
      logoUrl: req.body.logoUrl || "",
      dailyOn: req.body.dailyOn || "0",
      highestOn: req.body.highestOn || "0",
      statusServer: req.body.statusServer || "Fresh Server",
      whatsapp: req.body.whatsapp || "",
      paymentMethod: req.body.paymentMethod || req.body.payment || "",
      package: req.body.package,
      price: req.body.price || 0,
      status: req.body.status || "Pending",
      linkGroupWA: req.body.linkGroupWA || "",
      linkDiscord: req.body.linkDiscord || "",
      linkAllHost: req.body.linkAllHost || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("orders").add(newOrder);

    // Tambahkan ID ke dokumen agar bisa dihapus / diupdate nanti
    await docRef.update({ id: docRef.id });

    console.log(`✅ Order berhasil disimpan dengan ID: ${docRef.id}`);
    res.status(201).json({
      success: true,
      message: "Order berhasil dibuat.",
      order: { id: docRef.id, ...newOrder },
    });
  } catch (err) {
    console.error("❌ Error saat menyimpan order:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + err.message,
    });
  }
});

/**
 * 🟡 GET: Ambil semua order
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);
  } catch (err) {
    console.error("❌ Error mengambil orders:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🔵 PUT: Update status order
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📝 Update order ${id} ke status ${status}`);

    const orderRef = db.collection("orders").doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
    }

    await orderRef.update({ status });
    console.log(`✅ Order ${id} berhasil diupdate.`);

    res.json({ success: true, message: "Status order berhasil diupdate." });
  } catch (err) {
    console.error("❌ Gagal update order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 🗑️ DELETE: Hapus order berdasarkan ID (Firestore)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Request hapus order ID:", id);

    const docRef = db.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn("⚠️ Order tidak ditemukan:", id);
      return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
    }

    await docRef.delete();
    console.log(`✅ Order ${id} berhasil dihapus dari Firestore.`);

    res.json({ success: true, message: "Order berhasil dihapus." });
  } catch (err) {
    console.error("❌ Gagal menghapus order:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus order: " + err.message,
    });
  }
});

export default router;
