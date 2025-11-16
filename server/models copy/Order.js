import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    serverName: String,
    fitur: String,
    logoUrl: String,
    dailyOn: String,
    highestOn: String,
    statusServer: String,
    whatsapp: String,
    paymentMethod: String,
    package: String,
    price: Number,
    linkGroupWA: { type: String, default: "" },
    linkDiscord: { type: String, default: "" },
    linkAllHost: { type: String, default: "" },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
