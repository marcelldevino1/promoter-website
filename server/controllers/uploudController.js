import cloudinary from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

export const uploadLogo = async (req, res) => {
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      }); 
    };

    const result = await streamUpload(req);
    res.json({ logoUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", err });
  }
};
