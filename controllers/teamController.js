import Team from "../models/team.js";
import User from "../models/user.js";
import Volunteer from "../models/volunteer.js";

// Get All Teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Team
export const createTeam = async (req, res) => {
  try {
    const { name, description, lead, members, status } = req.body;

    if (!name || !lead) {
      return res.status(400).json({
        success: false,
        message: "Team Name and Team Lead are required."
      });
    }

    const team = new Team({
      name,
      description: description || "",
      lead,
      members: members || [],
      status: status || "active"
    });

    await team.save();

    res.status(201).json({
      success: true,
      message: "Team Created Successfully",
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, lead, members, status } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    if (name) team.name = name;
    if (description !== undefined) team.description = description;
    if (lead) team.lead = lead;
    if (members !== undefined) team.members = members;
    if (status) team.status = status;

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Candidates (Admins, Partners, and Volunteers)
export const getCandidates = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["admin", "partner"] } }).select("name email role clinicName");
    const volunteers = await Volunteer.find({}).select("name email role");

    const candidates = [];

    // Format Users (Admins and Partners)
    users.forEach(u => {
      candidates.push({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        clinicName: u.clinicName || ""
      });
    });

    // Format Volunteers
    volunteers.forEach(v => {
      candidates.push({
        id: v._id,
        name: v.name,
        email: v.email,
        role: v.role || "volunteer"
      });
    });

    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
