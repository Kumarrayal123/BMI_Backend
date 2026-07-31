import express from "express";
import { login, register, getAllPartners, unifiedLogin,
    updatePartner, deletePartner

 } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/unified-login", unifiedLogin);
router.get("/partners", getAllPartners);
router.put("/partner/:id", updatePartner);
router.put("/update-partner/:id", updatePartner);
// Delete Partner
router.delete("/partner/:id", deletePartner);
export default router;
