import express from "express";
import {
  createCommonVolunteer,
  getCommonVolunteers,
  deleteCommonVolunteer
} from "../controllers/commonVolunteerController.js";

const router = express.Router();

// Create new registration
router.post("/", createCommonVolunteer);

// Get all registrations
router.get("/", getCommonVolunteers);

// Delete a registration
router.delete("/:id", deleteCommonVolunteer);

export default router;
