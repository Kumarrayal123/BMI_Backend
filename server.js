import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import campRoutes from "./routes/campRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authProxyRoutes from "./routes/authProxyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// 🛡️ MIDDLEWARES
// ======================================================

// 1. Parser
app.use(express.json());

// 2. Logger
app.use((req, res, next) => {
  console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) console.log(`[BODY]`, JSON.stringify(req.body));
  next();
});

// 3. CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://attendancefrontend.vercel.app",
  "https://bmi-application.vercel.app",
  "https://timelyhealth.in",
  "https://www.timelyhealth.in"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ======================================================
// 🚀 ROUTES
// ======================================================

// Diagnostics
app.get("/api/ping", (req, res) => res.status(200).send("API IS ACTIVE - PONG"));

// Static Files
app.use("/reports", express.static(path.join(__dirname, "public/reports")));

// API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/proxy", authProxyRoutes);
app.use("/api/chat", chatRoutes);

// Home
app.get("/", (req, res) => res.json({ message: "BIM API Running" }));

// 🔍 404 Handler (MUST BE LAST ROUTE)
app.use((req, res) => {
  console.warn(`⚠️ [404] NOT MATCHED: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Path ${req.url} does not exist on this server.` });
});

// ======================================================
// 🔗 DATABASE & SERVER STARTup
// ======================================================

console.log("⏳ Connecting to MongoDB...");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n************************************************`);
      console.log(`🚀 API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`✅ ALL ROUTES REGISTERED AND READY`);
      console.log(`************************************************\n`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error(err);
    process.exit(1);
  });
