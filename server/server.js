import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";

import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔥 Inisialisasi Firebase Admin via ENV
try {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("❌ Firebase credentials are missing in .env");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  console.log("✅ Firebase Firestore Connected");
} catch (error) {
  console.error("🔥 Firebase initialization failed:", error.message);
}

// 🔗 Firestore Reference
const db = admin.firestore();
export { db };

// 🧭 Tes route sederhana
app.get("/", (req, res) => {
  res.send("🚀 Promoter Website API (Firebase) is Running...");
});

// 📦 Routes
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// 🚀 Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
