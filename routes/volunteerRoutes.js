import express from "express";

import {
  createVolunteerByPartner,
  getPartnerVolunteers,
  getVolunteerById,
  updateVolunteerByPartner,
  deleteVolunteerByPartner,
  getAllVolunteers,
} from "../controllers/volunteerController.js";

const router = express.Router();

// Create Volunteer
router.post("/create-by-partner/:partnerId", createVolunteerByPartner);

// Get All Volunteers (Admin)
router.get("/all-volunteers", getAllVolunteers);

// Get All Volunteers of Partner
router.get("/partner-volunteers/:partnerId", getPartnerVolunteers);

// Get Single Volunteer
router.get("/:volunteerId", getVolunteerById);

// Update Volunteer
router.put(
  "/update-volunteer/:partnerId/:volunteerId",
  updateVolunteerByPartner
);

// Delete Volunteer
router.delete(
  "/delete-volunteer/:partnerId/:volunteerId",
  deleteVolunteerByPartner
);

export default router;