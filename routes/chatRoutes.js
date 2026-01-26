import express from "express";
import { campChat } from "../controllers/campChat.controller.js";

const router = express.Router();

router.post("/camp-chat", campChat);

export default router;
