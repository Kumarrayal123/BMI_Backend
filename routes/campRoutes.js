// import express from "express";
// import mongoose from "mongoose";
// import Camp from "../models/camp.js";

// const router = express.Router();

// /* 📄 PING TEST */
// router.get("/ping", (req, res) => res.send("pong"));

// /* ➕ ADD CAMP */
// router.post("/addcamp", async (req, res) => {
//   try {
//     const { name, location, address, date, time, volunteers, partners } = req.body;
//     const camp = await Camp.create({
//       name,
//       location,
//       address,
//       date,
//       time,
//       volunteers,
//       partners: partners ? partners.map(p => ({ partnerId: p })) : []
//     });
//     res.status(201).json(camp);
//   } catch (err) {
//     console.error("ADD CAMP ERROR:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// /* 📄 GET ALL CAMPS */
// router.get("/allcamps", async (req, res) => {
//   try {
//     console.log("✅ GET /allcamps hit");
//     const camps = await Camp.find().sort({ createdAt: -1 }).populate("partners.partnerId", "name email clinicName");
//     res.json(camps);
//   } catch (err) {
//     console.error("GET CAMPS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// /* 📄 GET ASSIGNED CAMPS FOR PARTNER */
// router.get("/assigned-camps/:partnerId", async (req, res) => {
//   try {
//     const { partnerId } = req.params;
//     if (!partnerId || partnerId === "null" || partnerId === "undefined") {
//       return res.json([]);
//     }
//     const camps = await Camp.find({ "partners.partnerId": partnerId }).sort({ date: -1 });
//     res.json(camps);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// router.post("/update-assignment-status", async (req, res) => {
//   try {
//     const { campId, partnerId, status } = req.body;

//     const allowedStatuses = ["accepted", "rejected", "approved", "pending"]; // 'accepted' is what front-end sends
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     // 1. Fetch the camp first to check for existing acceptances
//     const camp = await Camp.findById(campId);
//     if (!camp) {
//       return res.status(404).json({ message: "Camp not found" });
//     }

//     // 2. Enforce Exclusive Booking
//     if (status === 'accepted') {
//       const isTaken = camp.partners.some(p =>
//         p.status === 'accepted' && String(p.partnerId) !== String(partnerId)
//       );
//       if (isTaken) {
//         return res.status(400).json({ message: "This camp has already been accepted by another doctor." });
//       }
//     }

//     // 3. Find and Update the specific partner's status
//     const partnerIndex = camp.partners.findIndex(p => String(p.partnerId) === String(partnerId));
//     if (partnerIndex === -1) {
//       return res.status(404).json({ message: "You are not assigned to this camp." });
//     }

//     camp.partners[partnerIndex].status = status;
//     await camp.save();

//     res.json(camp);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// export default router;


import express from "express";

import {
createCamp,
getAllCamps,
createCampByPartner,
updateCampByAdmin,
updateCampByPartner,
getPartnerCreatedCamps,
getAssignedCamps,
deleteCampByAdmin,
deleteCampByPartner,
hideCamp,
unhideCamp,
archiveOldCamps,
getArchivedCamps
} from "../controllers/campController.js";

const router=express.Router();

router.post("/addcamp",createCamp);

router.get("/allcamps",getAllCamps);
router.get("/partner-created-camps/:partnerId", getPartnerCreatedCamps);
router.post("/my-create-camp/:partnerId", createCampByPartner);
router.post("/create-by-partner", createCampByPartner);
router.get("/assigned-camps/:partnerId", getAssignedCamps);
router.put("/update-camp/:campId", updateCampByAdmin);
router.put("/update-partner-camp/:campId", updateCampByAdmin);
router.put("/update-camp/:partnerId/:campId", updateCampByPartner);
// ADMIN
router.delete("/delete-camp/:campId", deleteCampByAdmin);
// PARTNER
router.delete("/delete-camp/:partnerId/:campId", deleteCampByPartner);
// Hide/Archive camp
router.put('/hide-camp/:campId', hideCamp);

// Unhide/Restore camp
router.put('/unhide-camp/:campId', unhideCamp);

// Auto-archive old camps
router.post('/archive-old-camps', archiveOldCamps);

// Get archived camps
router.get('/archived-camps', getArchivedCamps);
export default router;