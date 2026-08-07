import CommonVolunteer from "../models/commonVolunteer.js";

export const createCommonVolunteer = async (req, res) => {
  try {
    const { name, email, phone, campName, campLocation, campDate, role, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide both Name and Mobile Phone number.",
      });
    }

    const sanitizedName = name.trim();
    const sanitizedPhone = phone.trim();
    const sanitizedEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${sanitizedName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') || 'volunteer'}@healthcamp.org`;

    const finalCampName = (campName && campName.trim()) ? campName.trim() : "Community Health Camp";
    const finalCampLocation = (campLocation && campLocation.trim()) ? campLocation.trim() : "Hyderabad";
    const finalCampDate = campDate ? new Date(campDate) : new Date();

    // Check if duplicate for the same phone & camp
    const existing = await CommonVolunteer.findOne({
      phone: sanitizedPhone,
      campName: finalCampName
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You have already registered as a volunteer for this health camp.",
        volunteer: existing,
      });
    }

    const volunteer = await CommonVolunteer.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      campName: finalCampName,
      campLocation: finalCampLocation,
      campDate: finalCampDate,
      role: role || "Camp Volunteer",
      status: status || "Confirmed",
      registeredAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      volunteer,
    });
  } catch (error) {
    console.error("Error in createCommonVolunteer:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all common volunteers
export const getCommonVolunteers = async (req, res) => {
  try {
    const volunteers = await CommonVolunteer.find().sort({ createdAt: -1 });

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

// Delete a common volunteer registration
export const deleteCommonVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await CommonVolunteer.findByIdAndDelete(id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer registration deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
