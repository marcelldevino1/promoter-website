import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
