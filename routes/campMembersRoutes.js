import express from "express";
import {
  getCampMembers,
  getAvailableMembers,
  assignPartner,
  removePartner,
  assignVolunteers,
  removeVolunteer
} from "../controllers/campMembersController.js";

const router = express.Router();

router.get("/:campId/members", getCampMembers);
router.get("/:campId/available-members", getAvailableMembers);
router.post("/:campId/assign-partner", assignPartner);
router.post("/:campId/remove-partner", removePartner);
router.post("/:campId/assign-volunteers", assignVolunteers);
router.post("/:campId/remove-volunteer", removeVolunteer);

export default router;
