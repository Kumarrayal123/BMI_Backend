import Volunteer from "../models/volunteer.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Create Volunteer
export const createVolunteerByPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await User.findById(partnerId);

    if (!partner || partner.role !== "partner") {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const existing = await Volunteer.findOne({
      email: req.body.email,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Volunteer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const volunteer = await Volunteer.create({
      ...req.body,
      password: hashedPassword,
      assignedPartner: partnerId,
      createdBy: partnerId,
      createdByRole: "partner",
    });

    res.status(201).json({
      success: true,
      message: "Volunteer created successfully",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Partner Volunteers
export const getPartnerVolunteers = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const volunteers = await Volunteer.find({
      assignedPartner: partnerId,
    }).populate("assignedPartner", "name email");

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Volunteer
export const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.volunteerId);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Volunteer
export const updateVolunteerByPartner = async (req, res) => {
  try {
    const { partnerId, volunteerId } = req.params;

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const volunteer = await Volunteer.findOneAndUpdate(
      {
        _id: volunteerId,
        assignedPartner: partnerId,
      },
      updateData,
      {
        new: true,
      }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Volunteer
export const deleteVolunteerByPartner = async (req, res) => {
  try {
    const { partnerId, volunteerId } = req.params;

    const volunteer = await Volunteer.findOneAndDelete({
      _id: volunteerId,
      assignedPartner: partnerId,
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Volunteers (Admin)
// ===============================
export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate("assignedPartner", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};