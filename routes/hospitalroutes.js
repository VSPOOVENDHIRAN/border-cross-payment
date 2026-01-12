import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerHospital } from '../controllers/hospitalcontroller.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.post('/register', upload.single('registrationCertificate'), registerHospital);

export default router;
