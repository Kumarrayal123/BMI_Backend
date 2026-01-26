import express from "express";
import mongoose from "mongoose";
import Camp from "../models/camp.js";

const router = express.Router();

/* 📄 PING TEST */
router.get("/ping", (req, res) => res.send("pong"));

/* ➕ ADD CAMP */
router.post("/addcamp", async (req, res) => {
  try {
    const { name, location, address, date, time, volunteers, partners } = req.body;
    const camp = await Camp.create({
      name,
      location,
      address,
      date,
      time,
      volunteers,
      partners: partners ? partners.map(p => ({ partnerId: p })) : []
    });
    res.status(201).json(camp);
  } catch (err) {
    console.error("ADD CAMP ERROR:", err);
    res.status(400).json({ message: err.message });
  }
});

/* 📄 GET ALL CAMPS */
router.get("/allcamps", async (req, res) => {
  try {
    console.log("✅ GET /allcamps hit");
    const camps = await Camp.find().sort({ createdAt: -1 }).populate("partners.partnerId", "name email clinicName");
    res.json(camps);
  } catch (err) {
    console.error("GET CAMPS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* 📄 GET ASSIGNED CAMPS FOR PARTNER */
router.get("/assigned-camps/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    if (!partnerId || partnerId === "null" || partnerId === "undefined") {
      return res.json([]);
    }
    const camps = await Camp.find({ "partners.partnerId": partnerId }).sort({ date: -1 });
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🔄 UPDATE ASSIGNMENT STATUS */
// router.post("/update-assignment-status", async (req, res) => {
//   try {
//     const { campId, partnerId, status } = req.body;
//     console.log(`\n[STATUS_UPDATE_REQUEST]`);
//     console.log(`- Request Body:`, JSON.stringify(req.body));

//     if (!campId || !partnerId || !status) {
//       return res.status(400).json({ message: "Missing required fields: campId, partnerId, or status" });
//     }

//     // 1. Find the camp
//     const camp = await Camp.findById(campId);
//     if (!camp) {
//       console.warn(`❌ Camp ${campId} not found`);
//       return res.status(404).json({ message: `Camp not found (ID: ${campId})` });
//     }

//     console.log(`- Found Camp: ${camp.name}`);
//     console.log(`- Partners assigned count: ${camp.partners.length}`);

//     // 2. Find the partner in the assignment array (Compare as STRINGS for maximum safety)
//     const partnerIndex = camp.partners.findIndex(p => {
//       const pid = p.partnerId?._id || p.partnerId;
//       return String(pid) === String(partnerId);
//     });

//     if (partnerIndex === -1) {
//       console.warn(`❌ Partner ${partnerId} not found in assignment list for Camp ${camp.name}`);
//       console.log(`- Current assignment IDs:`, camp.partners.map(p => String(p.partnerId?._id || p.partnerId)));
//       return res.status(404).json({ message: "You are not assigned to this camp." });
//     }

//     // 3. Update and Save
//     console.log(`✅ Assignment found! Updating status from ${camp.partners[partnerIndex].status} to ${status}`);
//     camp.partners[partnerIndex].status = status;
//     await camp.save();

//     console.log(`🚀 [SUCCESS] Assignment updated for Partner ${partnerId}`);
//     res.json(camp);
//   } catch (err) {
//     console.error("💥 [STATUS_UPDATE_CRASH]", err);
//     res.status(500).json({ message: "Server encountered an error: " + err.message });
//   }
// });

router.patch("/update-assignment-status", async (req, res) => {
  try {
    const { campId, partnerId, status } = req.body;

    const allowedStatuses = ["accepted", "rejected", "approved"]; // 'accepted' is what front-end sends
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 1. Fetch the camp first to check for existing acceptances
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // 2. Enforce Exclusive Booking
    if (status === 'accepted') {
      const isTaken = camp.partners.some(p =>
        p.status === 'accepted' && String(p.partnerId) !== String(partnerId)
      );
      if (isTaken) {
        return res.status(400).json({ message: "This camp has already been accepted by another doctor." });
      }
    }

    // 3. Find and Update the specific partner's status
    const partnerIndex = camp.partners.findIndex(p => String(p.partnerId) === String(partnerId));
    if (partnerIndex === -1) {
      return res.status(404).json({ message: "You are not assigned to this camp." });
    }

    camp.partners[partnerIndex].status = status;
    await camp.save();

    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
