import express from "express";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getCandidates
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getAllTeams);
router.post("/create", createTeam);
router.put("/update/:id", updateTeam);
router.delete("/delete/:id", deleteTeam);
router.get("/candidates", getCandidates);

export default router;
