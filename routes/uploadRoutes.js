import express from "express";
import multer from "multer";
import Patient from "../models/patient.js";
import fs from "fs";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    console.error("❌ CRITICAL ERROR: 'uploads' folder does NOT exist!");
} else {
    console.log("✅ 'uploads' folder found!");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `Report_${req.body.patientId}_${uniqueSuffix}.pdf`);
  },
});

const upload = multer({ storage: storage });

// ✅ UPLOAD ROUTE
router.post("/upload-report", upload.single("pdfReport"), async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }
    
    // 🚨 CRUCIAL CHECK: Agar req.file undefined hai, toh multer fail ho gaya
    if (!req.file) {
      // Error ka pura stack trace bhej rahe hain
      return res.status(400).json({ 
          success: false, 
          message: "MULTER FAILED. Backend couldn't save the file. Check if 'uploads' folder exists and has write permissions." 
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const baseUrl = `http://62.72.29.27:5000`;
    const pdfUrl = `${baseUrl}/uploads/${req.file.filename}`;

    patient.reportPdfUrl = pdfUrl;
    await patient.save();

    res.json({ success: true, fileUrl: pdfUrl });

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;