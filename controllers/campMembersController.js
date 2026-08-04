import Camp from "../models/camp.js";
import User from "../models/user.js";
import Volunteer from "../models/volunteer.js";
import mongoose from "mongoose";

// 1. Get Camp Members
export const getCampMembers = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID"
      });
    }

    const camp = await Camp.findById(campId)
      .populate("assignedPartner", "name email mobile address role clinicName canManageVolunteers")
      .populate({
        path: "volunteers",
        model: "Volunteer",
        select: "name email phone role createdAt gender address"
      });

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    // Format camp information
    const campInfo = {
      id: camp._id,
      name: camp.name,
      location: camp.location,
      address: camp.address,
      date: camp.date,
      time: camp.time,
      status: camp.status
    };

    // Format partner (doctor) information
    const assignedPartner = camp.assignedPartner ? {
      id: camp.assignedPartner._id,
      name: camp.assignedPartner.name,
      email: camp.assignedPartner.email,
      phone: camp.assignedPartner.mobile,
      clinicName: camp.assignedPartner.clinicName,
      canManageVolunteers: camp.assignedPartner.canManageVolunteers !== false,
      role: "partner",
      status: camp.partnerRequest?.status || "approved",
      assignedDate: camp.partnerAssignedAt || camp.createdAt
    } : null;

    // Format volunteer details
    const volunteersList = camp.volunteers ? camp.volunteers.map(v => ({
      id: v._id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      gender: v.gender,
      address: v.address,
      role: "volunteer",
      assignedDate: v.createdAt
    })) : [];

    res.status(200).json({
      success: true,
      data: {
        camp: campInfo,
        assignedPartner,
        volunteers: volunteersList
      }
    });
  } catch (error) {
    console.error("Error in getCampMembers:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Get Available Members (Partners and Volunteers not currently in the camp)
export const getAvailableMembers = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID"
      });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    // Existing partner ID and volunteer IDs
    const currentPartnerId = camp.assignedPartner;
    const currentVolunteerIds = camp.volunteers || [];

    // Fetch all partners except the current assigned partner
    const partnersQuery = { role: "partner" };
    if (currentPartnerId) {
      partnersQuery._id = { $ne: currentPartnerId };
    }
    const availablePartners = await User.find(partnersQuery).select("name email mobile clinicName");

    // Fetch all volunteers not currently assigned to the camp
    const volunteersQuery = {};
    if (currentVolunteerIds.length > 0) {
      volunteersQuery._id = { $nin: currentVolunteerIds };
    }
    const availableVolunteers = await Volunteer.find(volunteersQuery).select("name email phone designation");

    res.status(200).json({
      success: true,
      data: {
        partners: availablePartners.map(p => ({
          id: p._id,
          name: p.name,
          email: p.email,
          phone: p.mobile,
          clinicName: p.clinicName,
          role: "partner"
        })),
        volunteers: availableVolunteers.map(v => ({
          id: v._id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          designation: v.designation || "Volunteer",
          role: "volunteer"
        }))
      }
    });
  } catch (error) {
    console.error("Error in getAvailableMembers:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Assign Partner to Camp
export const assignPartner = async (req, res) => {
  try {
    const { campId } = req.params;
    const { partnerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(campId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID or Partner ID"
      });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== "partner") {
      return res.status(404).json({
        success: false,
        message: "Partner not found or is not a doctor/partner"
      });
    }

    camp.assignedPartner = partnerId;
    camp.partnerAssignedAt = new Date();
    
    // Add to partners list if not already present
    if (!camp.partners) camp.partners = [];
    const exists = camp.partners.some(p => String(p) === String(partnerId));
    if (!exists) {
      camp.partners.push(partnerId);
    }

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Partner assigned successfully",
      data: camp
    });
  } catch (error) {
    console.error("Error in assignPartner:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Remove Partner from Camp
export const removePartner = async (req, res) => {
  try {
    const { campId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID"
      });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    const oldPartnerId = camp.assignedPartner;
    
    camp.assignedPartner = null;
    camp.partnerAssignedAt = null;

    // Filter out old partner from partners array if needed
    if (oldPartnerId && camp.partners) {
      camp.partners = camp.partners.filter(p => String(p) !== String(oldPartnerId));
    }

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Partner removed successfully",
      data: camp
    });
  } catch (error) {
    console.error("Error in removePartner:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 5. Assign Volunteers to Camp
export const assignVolunteers = async (req, res) => {
  try {
    const { campId } = req.params;
    const { volunteerIds } = req.body; // Array of volunteer ObjectIds

    if (!mongoose.Types.ObjectId.isValid(campId) || !Array.isArray(volunteerIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID or volunteerIds array"
      });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    if (!camp.volunteers) camp.volunteers = [];

    // Merge new volunteers into camp.volunteers if not already present
    volunteerIds.forEach(vId => {
      if (mongoose.Types.ObjectId.isValid(vId)) {
        const objId = new mongoose.Types.ObjectId(vId);
        const exists = camp.volunteers.some(v => String(v) === String(objId));
        if (!exists) {
          camp.volunteers.push(objId);
        }
      }
    });

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Volunteers assigned successfully",
      data: camp
    });
  } catch (error) {
    console.error("Error in assignVolunteers:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 6. Remove Volunteer from Camp
export const removeVolunteer = async (req, res) => {
  try {
    const { campId } = req.params;
    const { volunteerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(campId) || !mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Camp ID or Volunteer ID"
      });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    if (camp.volunteers) {
      camp.volunteers = camp.volunteers.filter(v => String(v) !== String(volunteerId));
    }

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Volunteer removed successfully",
      data: camp
    });
  } catch (error) {
    console.error("Error in removeVolunteer:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
