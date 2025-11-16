import mongoose from "mongoose";

const adminSettingSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      required: [true, "Nomor WhatsApp wajib diisi"],
    },
  },
  { timestamps: true }
);

// ⚠️ Hindari re-registering model error (terutama saat pakai nodemon)
export default mongoose.models.AdminSetting ||
  mongoose.model("AdminSetting", adminSettingSchema);
