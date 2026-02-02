const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure directory exists
const uploadDir = "storage/certificates";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `cert_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// file filter (PDF + Images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};


const upload = multer({
  storage: multer.memoryStorage(), // ✅ IMPORTANT
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
