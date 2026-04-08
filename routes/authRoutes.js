import express from "express";
import { login, register, getAllPartners, unifiedLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/unified-login", unifiedLogin);
router.get("/partners", getAllPartners);

export default router;
