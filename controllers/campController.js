// import Camp from "../models/camp.js";

// /* ===========================================================
//    CREATE CAMP
// =========================================================== */

// export const createCamp = async (req, res) => {
//   try {
//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy,
//       creatorRole,
//       assignedPartner,
//       volunteers
//     } = req.body;

//     // Basic Validation
//     if (!name || !location || !date || !time) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, Location, Date and Time are required."
//       });
//     }

//     const camp = new Camp({
//       name,
//       location,
//       address,
//       date,
//       time,

//       createdBy,
//       creatorRole,

//       // Only admin can assign partner while creating
//       assignedPartner:
//         creatorRole === "admin"
//           ? assignedPartner || null
//           : null,

//       volunteers: volunteers || [],

//       status: "active"
//     });

//     await camp.save();

//     res.status(201).json({
//       success: true,
//       message: "Camp Created Successfully",
//       data: camp
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };

// /* ===========================================================
//    CREATE CAMP BY PARTNER
// =========================================================== */
// export const createCampByPartner = async (req, res) => {
//   try {

//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy,
//       volunteers
//     } = req.body;

//     if (!name || !location || !date || !time || !createdBy) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields are mandatory."
//       });
//     }

//     const camp = await Camp.create({

//       name,
//       location,
//       address,
//       date,
//       time,

//       createdBy,

//       creatorRole: "partner",

//       // Partner khud partner assign nahi kar sakta
//       assignedPartner: null,

//       assignedBy: null,

//       partnerAssignedAt: null,

//       volunteers: volunteers || [],

//       status: "active"

//     });

//     res.status(201).json({
//       success: true,
//       message: "Camp Created Successfully",
//       data: camp
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };

// /* ===========================================================
//    GET ALL CAMPS
// =========================================================== */
// export const getAssignedCamps = async (req, res) => {

//   try {

//     const { partnerId } = req.params;

//     const camps = await Camp.find({

//       assignedPartner: partnerId

//     })

//       .populate("createdBy", "name role")

//       .populate("assignedPartner", "name clinicName")

//       .populate("volunteers", "name email")

//       .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: camps.length,

//       data: camps

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message

//     });

//   }

// };

// /* ===========================================================
//     UPDATE CAMP By ADMIN
// =========================================================== */

// export const updateCampByAdmin = async (req, res) => {
//   try {

//     const { campId } = req.params;

//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       assignedPartner,
//       volunteers,
//       status
//     } = req.body;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     if (name) camp.name = name;
//     if (location) camp.location = location;
//     if (address) camp.address = address;
//     if (date) camp.date = date;
//     if (time) camp.time = time;

//     if (assignedPartner !== undefined) {
//       camp.assignedPartner = assignedPartner;
//     }

//     if (volunteers) {
//       camp.volunteers = volunteers;
//     }

//     if (status) {
//       camp.status = status;
//     }

//     await camp.save();

//     res.status(200).json({
//       success: true,
//       message: "Camp updated successfully",
//       data: camp
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };

// /* ===========================================================
//     UPDATE CAMP By PARTNER
// =========================================================== */
// export const updateCampByPartner = async (req, res) => {

//   try {

//     const { partnerId, campId } = req.params;

//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       volunteers,
//       status
//     } = req.body;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     // Sirf jis partner ne camp create kiya hai
//     // ya jise admin ne assign kiya hai wahi update kare

//     const isOwner =
//       String(camp.createdBy) === String(partnerId);

//     const isAssigned =
//       camp.assignedPartner &&
//       String(camp.assignedPartner) === String(partnerId);

//     if (!isOwner && !isAssigned) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to update this camp."
//       });
//     }

//     if (name) camp.name = name;

//     if (location) camp.location = location;

//     if (address) camp.address = address;

//     if (date) camp.date = date;

//     if (time) camp.time = time;

//     if (volunteers) {
//       camp.volunteers = volunteers;
//     }

//     // Partner sirf completed kar sakta hai

//     if (status === "completed") {
//       camp.status = "completed";
//     }

//     await camp.save();

//     res.status(200).json({
//       success: true,
//       message: "Camp updated successfully",
//       data: camp
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }

// };

// /* ===========================================================
//    GET ALL CAMPS
// =========================================================== */

// export const getAllCamps = async (req, res) => {

//   try {

//     const camps = await Camp.find()

//       .populate("createdBy", "name role clinicName")

//       .populate("assignedPartner", "name clinicName")

//       .populate("volunteers", "name email")

//       .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: camps.length,

//       data: camps

//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({

//       success: false,

//       message: error.message

//     });

//   }

// };

// /* ===========================================================
//    GET PARTNER CREATED CAMPS
// =========================================================== */

// export const getPartnerCreatedCamps = async (req, res) => {

//   try {

//     const { partnerId } = req.params;

//     const camps = await Camp.find({
//       createdBy: partnerId,
//       creatorRole: "partner"
//     })

//       .populate("createdBy", "name clinicName")

//       .populate("assignedPartner", "name clinicName")

//       .populate("volunteers", "name email")

//       .sort({ createdAt: -1 });

//     res.status(200).json({

//       success: true,

//       count: camps.length,

//       data: camps

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message

//     });

//   }

// };

// /* ===========================================================
//    DELETE CAMP BY ADMIN
// =========================================================== */

// export const deleteCampByAdmin = async (req, res) => {

//   try {

//     const { campId } = req.params;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     await Camp.findByIdAndDelete(campId);

//     res.status(200).json({
//       success: true,
//       message: "Camp deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }

// };

// /* ===========================================================
//    DELETE CAMP BY PARTNER
// =========================================================== */

// export const deleteCampByPartner = async (req, res) => {

//   try {

//     const { partnerId, campId } = req.params;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     // Sirf apna create kiya hua camp delete kar sakta hai
//     if (String(camp.createdBy) !== String(partnerId)) {
//       return res.status(403).json({
//         success: false,
//         message: "You can delete only your own camp."
//       });
//     }

//     await Camp.findByIdAndDelete(campId);

//     res.status(200).json({
//       success: true,
//       message: "Camp deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }

// };

// import mongoose from "mongoose";
// import Camp from "../models/camp.js";

// /* ===========================================================
//    CREATE CAMP
// =========================================================== */

// export const createCamp = async (req, res) => {
//   try {
//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy,
//       creatorRole,
//       assignedPartner,
//       volunteers
//     } = req.body;

//     console.log("📥 Creating camp - Received volunteers:", volunteers);
//     console.log("📥 Volunteers type:", typeof volunteers);
//     console.log("📥 Is array:", Array.isArray(volunteers));

//     if (!name || !location || !date || !time) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, Location, Date and Time are required."
//       });
//     }

//     // 🔥 FIX: Ensure volunteers is an array of strings
//     let volunteerData = [];
//     if (volunteers && Array.isArray(volunteers)) {
//       volunteerData = volunteers.map(v => String(v).trim());
//     } else if (typeof volunteers === 'string') {
//       volunteerData = [String(volunteers).trim()];
//     }

//     console.log("✅ Processed volunteers:", volunteerData);

//     const camp = new Camp({
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy: createdBy || null,
//       creatorRole: creatorRole || "admin",
//       assignedPartner: creatorRole === "admin" ? (assignedPartner || null) : null,
//       volunteers: volunteerData,  // ✅ Always array of strings
//       status: "active"
//     });

//     await camp.save();

//     res.status(201).json({
//       success: true,
//       message: "Camp Created Successfully",
//       data: camp
//     });

//   } catch (error) {
//     console.log("❌ CREATE CAMP ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    CREATE CAMP BY PARTNER
// =========================================================== */
// export const createCampByPartner = async (req, res) => {
//   try {
//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy,
//       volunteers
//     } = req.body;

//     console.log("📥 Partner creating camp - Received volunteers:", volunteers);

//     if (!name || !location || !date || !time || !createdBy) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields are mandatory."
//       });
//     }

//     // 🔥 FIX: Ensure volunteers is an array of strings
//     let volunteerData = [];
//     if (volunteers && Array.isArray(volunteers)) {
//       volunteerData = volunteers.map(v => String(v).trim());
//     } else if (typeof volunteers === 'string') {
//       volunteerData = [String(volunteers).trim()];
//     }

//     console.log("✅ Processed volunteers:", volunteerData);

//     const camp = await Camp.create({
//       name,
//       location,
//       address,
//       date,
//       time,
//       createdBy,
//       creatorRole: "partner",
//       assignedPartner: null,
//       assignedBy: null,
//       partnerAssignedAt: null,
//       volunteers: volunteerData,  // ✅ Always array of strings
//       status: "active"
//     });

//     res.status(201).json({
//       success: true,
//       message: "Camp Created Successfully",
//       data: camp
//     });

//   } catch (error) {
//     console.log("❌ CREATE CAMP BY PARTNER ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    UPDATE CAMP By ADMIN
// =========================================================== */
// export const updateCampByAdmin = async (req, res) => {
//   try {
//     const { campId } = req.params;
//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       assignedPartner,
//       volunteers,
//       status
//     } = req.body;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     if (name) camp.name = name;
//     if (location) camp.location = location;
//     if (address) camp.address = address;
//     if (date) camp.date = date;
//     if (time) camp.time = time;

//     if (assignedPartner !== undefined) {
//       camp.assignedPartner = assignedPartner;
//     }

//     // 🔥 FIX: Ensure volunteers is an array of strings
//     if (volunteers !== undefined) {
//       let volunteerData = [];
//       if (Array.isArray(volunteers)) {
//         volunteerData = volunteers.map(v => String(v).trim());
//       } else if (typeof volunteers === 'string') {
//         volunteerData = [String(volunteers).trim()];
//       }
//       camp.volunteers = volunteerData;
//     }

//     if (status) {
//       camp.status = status;
//     }

//     await camp.save();

//     res.status(200).json({
//       success: true,
//       message: "Camp updated successfully",
//       data: camp
//     });

//   } catch (error) {
//     console.log("UPDATE CAMP BY ADMIN ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    UPDATE CAMP By PARTNER
// =========================================================== */
// export const updateCampByPartner = async (req, res) => {
//   try {
//     const { partnerId, campId } = req.params;
//     const {
//       name,
//       location,
//       address,
//       date,
//       time,
//       volunteers,
//       status
//     } = req.body;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     const isOwner = String(camp.createdBy) === String(partnerId);
//     const isAssigned = camp.assignedPartner && String(camp.assignedPartner) === String(partnerId);

//     if (!isOwner && !isAssigned) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to update this camp."
//       });
//     }

//     if (name) camp.name = name;
//     if (location) camp.location = location;
//     if (address) camp.address = address;
//     if (date) camp.date = date;
//     if (time) camp.time = time;

//     // 🔥 FIX: Ensure volunteers is an array of strings
//     if (volunteers !== undefined) {
//       let volunteerData = [];
//       if (Array.isArray(volunteers)) {
//         volunteerData = volunteers.map(v => String(v).trim());
//       } else if (typeof volunteers === 'string') {
//         volunteerData = [String(volunteers).trim()];
//       }
//       camp.volunteers = volunteerData;
//     }

//     if (status === "completed") {
//       camp.status = "completed";
//     }

//     await camp.save();

//     res.status(200).json({
//       success: true,
//       message: "Camp updated successfully",
//       data: camp
//     });

//   } catch (error) {
//     console.log("UPDATE CAMP BY PARTNER ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    GET ASSIGNED CAMPS
// =========================================================== */
// export const getAssignedCamps = async (req, res) => {
//   try {
//     const { partnerId } = req.params;

//     if (!partnerId || partnerId === "null" || partnerId === "undefined") {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         data: []
//       });
//     }

//     const camps = await Camp.find({
//       assignedPartner: partnerId
//     })
//       .populate("createdBy", "name role")
//       .populate("assignedPartner", "name clinicName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: camps.length,
//       data: camps
//     });

//   } catch (error) {
//     console.log("GET ASSIGNED CAMPS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    GET ALL CAMPS
// =========================================================== */
// export const getAllCamps = async (req, res) => {
//   try {
//     const camps = await Camp.find()
//       .populate("createdBy", "name role clinicName")
//       .populate("assignedPartner", "name clinicName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: camps.length,
//       data: camps
//     });

//   } catch (error) {
//     console.log("GET ALL CAMPS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    GET PARTNER CREATED CAMPS
// =========================================================== */
// export const getPartnerCreatedCamps = async (req, res) => {
//   try {
//     const { partnerId } = req.params;

//     if (!partnerId || partnerId === "null" || partnerId === "undefined") {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         data: []
//       });
//     }

//     const camps = await Camp.find({
//       createdBy: partnerId,
//       creatorRole: "partner"
//     })
//       .populate("createdBy", "name clinicName")
//       .populate("assignedPartner", "name clinicName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: camps.length,
//       data: camps
//     });

//   } catch (error) {
//     console.log("GET PARTNER CREATED CAMPS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    DELETE CAMP BY ADMIN
// =========================================================== */
// export const deleteCampByAdmin = async (req, res) => {
//   try {
//     const { campId } = req.params;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     await Camp.findByIdAndDelete(campId);

//     res.status(200).json({
//       success: true,
//       message: "Camp deleted successfully"
//     });

//   } catch (error) {
//     console.log("DELETE CAMP BY ADMIN ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /* ===========================================================
//    DELETE CAMP BY PARTNER
// =========================================================== */
// export const deleteCampByPartner = async (req, res) => {
//   try {
//     const { partnerId, campId } = req.params;

//     const camp = await Camp.findById(campId);

//     if (!camp) {
//       return res.status(404).json({
//         success: false,
//         message: "Camp not found"
//       });
//     }

//     if (String(camp.createdBy) !== String(partnerId)) {
//       return res.status(403).json({
//         success: false,
//         message: "You can delete only your own camp."
//       });
//     }

//     await Camp.findByIdAndDelete(campId);

//     res.status(200).json({
//       success: true,
//       message: "Camp deleted successfully"
//     });

//   } catch (error) {
//     console.log("DELETE CAMP BY PARTNER ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


import mongoose from "mongoose";
import Camp from "../models/camp.js";
import User from "../models/user.js";
import Volunteer from "../models/volunteer.js";
import Patient from "../models/patient.js";


// Helper function to safely populate fields in camp documents
const safePopulateCamps = async (camps) => {
  if (!camps) return camps;
  const isArray = Array.isArray(camps);
  const campList = isArray ? camps : [camps];

  const userIds = new Set();
  const volunteerIds = new Set();

  campList.forEach(camp => {
    if (camp.createdBy && mongoose.Types.ObjectId.isValid(camp.createdBy) && String(camp.createdBy).length === 24) {
      userIds.add(String(camp.createdBy));
    }
    if (camp.assignedPartner && mongoose.Types.ObjectId.isValid(camp.assignedPartner) && String(camp.assignedPartner).length === 24) {
      userIds.add(String(camp.assignedPartner));
    }
    if (camp.partners && Array.isArray(camp.partners)) {
      camp.partners.forEach(p => {
        if (p && mongoose.Types.ObjectId.isValid(p) && String(p).length === 24) {
          userIds.add(String(p));
        }
      });
    }
    if (camp.volunteers && Array.isArray(camp.volunteers)) {
      camp.volunteers.forEach(v => {
        if (v && mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
          volunteerIds.add(String(v));
        }
      });
    }
  });

  const [users, volunteers] = await Promise.all([
    User.find({ _id: { $in: Array.from(userIds).map(id => new mongoose.Types.ObjectId(id)) } })
      .select("name email mobile address role clinicName canManageVolunteers")
      .lean(),
    Volunteer.find({ _id: { $in: Array.from(volunteerIds).map(id => new mongoose.Types.ObjectId(id)) } })
      .select("name email phone designation role createdAt gender address")
      .lean()
  ]);

  const userMap = {};
  users.forEach(u => {
    userMap[String(u._id)] = u;
  });

  const volunteerMap = {};
  volunteers.forEach(v => {
    volunteerMap[String(v._id)] = v;
  });

  const populatedCamps = campList.map(camp => {
    const campObj = camp.toObject ? camp.toObject() : JSON.parse(JSON.stringify(camp));

    if (campObj.createdBy) {
      const idStr = String(campObj.createdBy);
      if (userMap[idStr]) {
        campObj.createdBy = userMap[idStr];
      } else if (mongoose.Types.ObjectId.isValid(campObj.createdBy) && idStr.length === 24) {
        campObj.createdBy = { _id: campObj.createdBy, name: "Unknown User" };
      } else {
        campObj.createdBy = { name: String(campObj.createdBy) };
      }
    } else {
      campObj.createdBy = null;
    }

    if (campObj.assignedPartner) {
      const idStr = String(campObj.assignedPartner);
      if (userMap[idStr]) {
        campObj.assignedPartner = userMap[idStr];
      } else if (mongoose.Types.ObjectId.isValid(campObj.assignedPartner) && idStr.length === 24) {
        campObj.assignedPartner = { _id: campObj.assignedPartner, name: "Unknown Partner" };
      } else {
        campObj.assignedPartner = { name: String(campObj.assignedPartner) };
      }
    } else {
      campObj.assignedPartner = null;
    }

    if (campObj.partners && Array.isArray(campObj.partners)) {
      campObj.partners = campObj.partners.map(p => {
        const idStr = String(p);
        if (userMap[idStr]) {
          return userMap[idStr];
        } else if (mongoose.Types.ObjectId.isValid(p) && idStr.length === 24) {
          return { _id: p, name: "Unknown Partner" };
        } else {
          return { name: String(p) };
        }
      });
    } else {
      campObj.partners = [];
    }

    if (campObj.volunteers && Array.isArray(campObj.volunteers)) {
      campObj.volunteers = campObj.volunteers.map(v => {
        const idStr = String(v);
        if (volunteerMap[idStr]) {
          return volunteerMap[idStr];
        } else if (mongoose.Types.ObjectId.isValid(v) && idStr.length === 24) {
          return { _id: v, name: "Unknown Volunteer" };
        } else {
          return { name: String(v) };
        }
      });
    } else {
      campObj.volunteers = [];
    }

    return campObj;
  });

  return isArray ? populatedCamps : populatedCamps[0];
};

/* ===========================================================
   CREATE CAMP
=========================================================== */

export const createCamp = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      date,
      time,
      createdBy,
      creatorRole,
      assignedPartner,
      volunteers,
      partners
    } = req.body;

    console.log("📥 Creating camp - Received:", {
      name,
      location,
      date,
      time,
      createdBy,
      creatorRole,
      volunteers,
      partners
    });

    if (!name || !location || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, Location, Date and Time are required."
      });
    }

    let createdByData = null;
    if (createdBy) {
      if (mongoose.Types.ObjectId.isValid(createdBy) && String(createdBy).length === 24) {
        createdByData = new mongoose.Types.ObjectId(createdBy);
      } else {
        createdByData = String(createdBy).trim();
      }
    }

    let volunteerData = [];
    if (volunteers && Array.isArray(volunteers)) {
      volunteerData = volunteers.map(v => {
        if (mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
          return new mongoose.Types.ObjectId(v);
        }
        return String(v).trim();
      });
    } else if (typeof volunteers === 'string') {
      volunteerData = [String(volunteers).trim()];
    }

    let partnerData = [];
    if (partners && Array.isArray(partners)) {
      partnerData = partners.map(p => {
        if (mongoose.Types.ObjectId.isValid(p) && String(p).length === 24) {
          return new mongoose.Types.ObjectId(p);
        }
        return String(p).trim();
      });
    }

    let assignedPartnerData = null;
    if (creatorRole === "admin") {
      if (assignedPartner) {
        if (mongoose.Types.ObjectId.isValid(assignedPartner) && String(assignedPartner).length === 24) {
          assignedPartnerData = new mongoose.Types.ObjectId(assignedPartner);
        } else {
          assignedPartnerData = String(assignedPartner).trim();
        }
      }
    } else if (creatorRole === "partner") {
      assignedPartnerData = createdByData;
    }

    if (assignedPartnerData) {
      const assignedStr = String(assignedPartnerData);
      const exists = partnerData.some(p => String(p) === assignedStr);
      if (!exists) {
        partnerData.push(assignedPartnerData);
      }
    }

    console.log("✅ Processed:", { createdByData, volunteerData, partnerData, assignedPartnerData });

    const camp = new Camp({
      name,
      location,
      address: address || "",
      date,
      time,
      createdBy: createdByData,
      creatorRole: creatorRole || "admin",
      assignedPartner: assignedPartnerData,
      partners: partnerData,
      volunteers: volunteerData,
      status: "active"
    });

    await camp.save();

    res.status(201).json({
      success: true,
      message: "Camp Created Successfully",
      data: camp
    });

  } catch (error) {
    console.log("❌ CREATE CAMP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   CREATE CAMP BY PARTNER
=========================================================== */

export const createCampByPartner = async (req, res) => {
    try {
        const {
            name,
            location,
            address,
            date,
            time,
            createdBy,
            volunteers,
            partners
        } = req.body;

        console.log("📥 Partner creating camp:", { name, location, createdBy });

        if (!name || !location || !date || !time || !createdBy) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory."
            });
        }

        let createdByData = null;
        if (createdBy) {
            if (mongoose.Types.ObjectId.isValid(createdBy) && String(createdBy).length === 24) {
                createdByData = new mongoose.Types.ObjectId(createdBy);
            } else {
                createdByData = String(createdBy).trim();
            }
        }

        let volunteerData = [];
        if (volunteers && Array.isArray(volunteers)) {
            volunteerData = volunteers.map(v => {
                if (mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
                    return new mongoose.Types.ObjectId(v);
                }
                return String(v).trim();
            });
        }

        let partnerData = [];
        if (partners && Array.isArray(partners)) {
            partnerData = partners.map(p => {
                if (mongoose.Types.ObjectId.isValid(p) && String(p).length === 24) {
                    return new mongoose.Types.ObjectId(p);
                }
                return String(p).trim();
            });
        }

        if (createdByData) {
            const creatorStr = String(createdByData);
            const exists = partnerData.some(p => String(p) === creatorStr);
            if (!exists) {
                partnerData.push(createdByData);
            }
        }

        const camp = await Camp.create({
            name,
            location,
            address: address || "",
            date,
            time,
            createdBy: createdByData,
            creatorRole: "partner",
            assignedPartner: createdByData,
            assignedBy: createdByData,
            partnerAssignedAt: new Date(),
            volunteers: volunteerData,
            partners: partnerData,
            partnerRequest: {
                requested: false,
                requestedBy: null,
                status: "pending"
            },
            status: "active"
        });

        console.log("✅ Camp created with assignedPartner:", camp.assignedPartner);
        console.log("✅ Camp partners:", camp.partners);

        res.status(201).json({
            success: true,
            message: "Camp Created Successfully",
            data: camp
        });

    } catch (error) {
        console.log("❌ CREATE CAMP BY PARTNER ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===========================================================
   🔥🔥🔥 FINAL FIX: GET ASSIGNED CAMPS - NO CAST ERROR
=========================================================== */

export const getAssignedCamps = async (req, res) => {
  try {
    const { partnerId } = req.params;

    console.log("🔍 GET ASSIGNED CAMPS - partnerId:", partnerId);

    if (!partnerId || partnerId === "null" || partnerId === "undefined" || partnerId === "") {
      console.log("⚠️ Invalid partnerId, returning empty array");
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // 🔥 Sabhi camps fetch karo
    const allCamps = await Camp.find({}).lean();
    console.log(`📦 Total camps in DB: ${allCamps.length}`);

    // 🔥 Manual filter - string comparison se
    const partnerIdStr = String(partnerId).trim();
    const filteredCamps = allCamps.filter(camp => {
      // Check assignedPartner
      if (camp.assignedPartner) {
        const assignedStr = String(camp.assignedPartner).trim();
        if (assignedStr === partnerIdStr) {
          return true;
        }
      }
      
      // Check createdBy
      if (camp.createdBy) {
        const createdStr = String(camp.createdBy).trim();
        if (createdStr === partnerIdStr) {
          return true;
        }
      }
      
      // Check partners array
      if (camp.partners && Array.isArray(camp.partners)) {
        const hasPartner = camp.partners.some(p => {
          if (!p) return false;
          return String(p).trim() === partnerIdStr;
        });
        if (hasPartner) {
          return true;
        }
      }
      
      return false;
    });

    console.log(`✅ Found ${filteredCamps.length} camps for partner`);

    filteredCamps.forEach((camp, index) => {
      console.log(`   ${index + 1}. ${camp.name} - assignedPartner: ${camp.assignedPartner}, createdBy: ${camp.createdBy}`);
    });

    res.status(200).json({
      success: true,
      count: filteredCamps.length,
      data: filteredCamps
    });

  } catch (error) {
    console.log("❌ GET ASSIGNED CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   GET ALL CAMPS
=========================================================== */

export const getAllCamps = async (req, res) => {
  try {
    console.log("🔄 Fetching all camps...");
    
    const camps = await Camp.find({})
      .sort({ createdAt: -1 });

    const populatedCamps = await safePopulateCamps(camps);

    console.log(`✅ Found ${populatedCamps.length} camps`);
    
    res.status(200).json({
      success: true,
      count: populatedCamps.length,
      data: populatedCamps
    });

  } catch (error) {
    console.log("❌ GET ALL CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   GET PARTNER CREATED CAMPS - FIXED
=========================================================== */

export const getPartnerCreatedCamps = async (req, res) => {
  try {
    const { partnerId } = req.params;

    console.log("🔍 Getting partner created camps for:", partnerId);

    if (!partnerId || partnerId === "null" || partnerId === "undefined") {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // 🔥 Sabhi camps fetch karo
    const allCamps = await Camp.find({}).lean();
    
    // 🔥 Manual filter - string comparison
    const partnerIdStr = String(partnerId).trim();
    const filteredCamps = allCamps.filter(camp => {
      if (camp.createdBy && String(camp.createdBy).trim() === partnerIdStr) {
        return true;
      }
      return false;
    });

    console.log(`✅ Found ${filteredCamps.length} created camps`);

    res.status(200).json({
      success: true,
      count: filteredCamps.length,
      data: filteredCamps
    });

  } catch (error) {
    console.log("❌ GET PARTNER CREATED CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   UPDATE CAMP By ADMIN
=========================================================== */

export const updateCampByAdmin = async (req, res) => {
  try {
    const { campId } = req.params;
    const {
      name,
      location,
      address,
      date,
      time,
      assignedPartner,
      volunteers,
      partners,
      status
    } = req.body;

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    if (name) camp.name = name;
    if (location) camp.location = location;
    if (address) camp.address = address;
    if (date) camp.date = date;
    if (time) camp.time = time;

    if (assignedPartner !== undefined) {
      if (assignedPartner) {
        let pVal;
        if (mongoose.Types.ObjectId.isValid(assignedPartner) && String(assignedPartner).length === 24) {
          pVal = new mongoose.Types.ObjectId(assignedPartner);
        } else {
          pVal = String(assignedPartner).trim();
        }
        camp.assignedPartner = pVal;
      } else {
        camp.assignedPartner = null;
      }
    }

    if (partners !== undefined && Array.isArray(partners)) {
      const partnerData = partners.map(p => {
        if (mongoose.Types.ObjectId.isValid(p) && String(p).length === 24) {
          return new mongoose.Types.ObjectId(p);
        }
        return String(p).trim();
      });
      
      if (camp.assignedPartner) {
        const assignedStr = String(camp.assignedPartner);
        const exists = partnerData.some(p => String(p) === assignedStr);
        if (!exists) {
          partnerData.push(camp.assignedPartner);
        }
      }
      camp.partners = partnerData;
    }

    if (volunteers !== undefined) {
      let volunteerData = [];
      if (Array.isArray(volunteers)) {
        volunteerData = volunteers.map(v => {
          if (mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
            return new mongoose.Types.ObjectId(v);
          }
          return String(v).trim();
        });
      } else if (typeof volunteers === 'string') {
        volunteerData = [String(volunteers).trim()];
      }
      camp.volunteers = volunteerData;
    }

    if (status) {
      camp.status = status;
    }

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Camp updated successfully",
      data: camp
    });

  } catch (error) {
    console.log("❌ UPDATE CAMP BY ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   UPDATE CAMP By PARTNER
=========================================================== */

export const updateCampByPartner = async (req, res) => {
  try {
    const { partnerId, campId } = req.params;
    const {
      name,
      location,
      address,
      date,
      time,
      volunteers,
      partners,
      status
    } = req.body;

    console.log(`📝 Partner ${partnerId} updating camp ${campId}`);

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    const isOwner = String(camp.createdBy) === String(partnerId);
    const isAssigned = camp.assignedPartner && String(camp.assignedPartner) === String(partnerId);

    if (!isOwner && !isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this camp."
      });
    }

    if (name) camp.name = name;
    if (location) camp.location = location;
    if (address) camp.address = address;
    if (date) camp.date = date;
    if (time) camp.time = time;

    if (partners !== undefined && Array.isArray(partners)) {
      const partnerData = partners.map(p => {
        if (mongoose.Types.ObjectId.isValid(p) && String(p).length === 24) {
          return new mongoose.Types.ObjectId(p);
        }
        return String(p).trim();
      });
      
      if (camp.assignedPartner) {
        const assignedStr = String(camp.assignedPartner);
        const exists = partnerData.some(p => String(p) === assignedStr);
        if (!exists) {
          partnerData.push(camp.assignedPartner);
        }
      }
      camp.partners = partnerData;
    }

    if (volunteers !== undefined) {
      let volunteerData = [];
      if (Array.isArray(volunteers)) {
        volunteerData = volunteers.map(v => {
          if (mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
            return new mongoose.Types.ObjectId(v);
          }
          return String(v).trim();
        });
      } else if (typeof volunteers === 'string') {
        volunteerData = [String(volunteers).trim()];
      }
      camp.volunteers = volunteerData;
    }

    if (status === "completed") {
      camp.status = "completed";
    }

    await camp.save();

    res.status(200).json({
      success: true,
      message: "Camp updated successfully",
      data: camp
    });

  } catch (error) {
    console.log("❌ UPDATE CAMP BY PARTNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   DELETE CAMP BY ADMIN
=========================================================== */

export const deleteCampByAdmin = async (req, res) => {
  try {
    const { campId } = req.params;

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    await Camp.findByIdAndDelete(campId);

    res.status(200).json({
      success: true,
      message: "Camp deleted successfully"
    });

  } catch (error) {
    console.log("❌ DELETE CAMP BY ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   DELETE CAMP BY PARTNER
=========================================================== */

export const deleteCampByPartner = async (req, res) => {
  try {
    const { partnerId, campId } = req.params;

    console.log(`🗑️ Partner ${partnerId} deleting camp ${campId}`);

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    if (String(camp.createdBy) !== String(partnerId)) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own camp."
      });
    }

    await Camp.findByIdAndDelete(campId);

    res.status(200).json({
      success: true,
      message: "Camp deleted successfully"
    });

  } catch (error) {
    console.log("❌ DELETE CAMP BY PARTNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   HIDE/ARCHIVE CAMP
=========================================================== */

export const hideCamp = async (req, res) => {
  try {
    const { campId } = req.params;
    const { isHidden } = req.body;

    console.log(`🔒 Hiding camp: ${campId}, isHidden: ${isHidden}`);

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    camp.isHidden = isHidden !== undefined ? isHidden : true;
    await camp.save();

    console.log(`✅ Camp ${campId} ${camp.isHidden ? 'hidden' : 'unhidden'} successfully`);

    res.status(200).json({
      success: true,
      message: camp.isHidden ? "Camp archived successfully" : "Camp restored successfully",
      data: camp
    });

  } catch (error) {
    console.log("❌ HIDE CAMP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   UNHIDE/RESTORE CAMP
=========================================================== */

export const unhideCamp = async (req, res) => {
  try {
    const { campId } = req.params;

    console.log(`🔓 Unhiding camp: ${campId}`);

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    camp.isHidden = false;
    await camp.save();

    console.log(`✅ Camp ${campId} restored successfully`);

    res.status(200).json({
      success: true,
      message: "Camp restored successfully",
      data: camp
    });

  } catch (error) {
    console.log("❌ UNHIDE CAMP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   AUTO-ARCHIVE OLD CAMPS (10+ days)
=========================================================== */

export const archiveOldCamps = async (req, res) => {
  try {
    const { days = 10 } = req.body;

    console.log(`📦 Archiving camps older than ${days} days`);

    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    console.log(`Cutoff date: ${cutoffDate.toISOString()}`);

    const oldCamps = await Camp.find({
      $or: [
        { createdAt: { $lt: cutoffDate } },
        { date: { $lt: cutoffDate.toISOString().split('T')[0] } }
      ],
      isHidden: { $ne: true }
    });

    console.log(`Found ${oldCamps.length} camps older than ${days} days`);

    let archivedCount = 0;
    const archivedCamps = [];

    for (const camp of oldCamps) {
      try {
        camp.isHidden = true;
        await camp.save();
        archivedCount++;
        archivedCamps.push({
          id: camp._id,
          name: camp.name,
          date: camp.date || camp.createdAt
        });
        console.log(`✅ Archived: ${camp.name}`);
      } catch (err) {
        console.error(`❌ Failed to archive ${camp.name}:`, err.message);
      }
    }

    console.log(`✅ Auto-archived ${archivedCount} camps`);

    res.status(200).json({
      success: true,
      message: `${archivedCount} camps auto-archived successfully`,
      archivedCount,
      archivedCamps
    });

  } catch (error) {
    console.log("❌ ARCHIVE OLD CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   GET HIDDEN/ARCHIVED CAMPS
=========================================================== */

export const getArchivedCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ isHidden: true })
      .sort({ createdAt: -1 });

    const populatedCamps = await safePopulateCamps(camps);

    res.status(200).json({
      success: true,
      count: populatedCamps.length,
      data: populatedCamps
    });

  } catch (error) {
    console.log("❌ GET ARCHIVED CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// =============================================
// GET ASSIGNED CAMPS FOR VOLUNTEER (With Patients)
// =============================================
export const getAssignedCampsForVolunteer = async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName || employeeName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "employeeName query parameter is required"
      });
    }

    console.log(`🔄 Fetching camps and patients for employee: ${employeeName}`);

    // 1. Employee ke camps fetch karo
    const escapedName = employeeName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    const query = { 
      volunteers: { $regex: new RegExp(`^${escapedName}$`, "i") } 
    };

    const camps = await Camp.find(query).sort({ createdAt: -1 });

    if (!camps || camps.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: `No camps found for ${employeeName}`,
        data: []
      });
    }

    // 2. Camps ko populate karo (Partner/Volunteer details ke liye)
    const populatedCamps = await safePopulateCamps(camps);

    // 3. Un saare camps ki IDs nikaalo
    const campIds = populatedCamps.map(camp => camp._id);

    // 4. Ek hi query mein un saare camps ke patients fetch karo
    const allPatients = await Patient.find({ campId: { $in: campIds } })
      .populate("campId", "name location")
      .select("+reportPdfUrl")
      .sort({ createdAt: -1 })
      .lean(); // Lean use karenge taaki plain JSON object mile aur modify karna easy ho

    // 5. Ek map banayo (Camp ID => Patients Array) taaki jaldi merge ho sake
    const patientsByCampId = {};
    allPatients.forEach(patient => {
      // patient.campId populated hai, toh iski _id nikaalo
      const cId = String(patient.campId?._id || patient.campId);
      if (!patientsByCampId[cId]) {
        patientsByCampId[cId] = [];
      }
      patientsByCampId[cId].push(patient);
    });

    // 6. Har camp ke object mein uske respective patients daal do
    const campsWithPatients = populatedCamps.map(camp => {
      const campObj = camp.toObject ? camp.toObject() : camp; // Mongoose document ko plain object banaya
      const cId = String(campObj._id);
      
      return {
        ...campObj,
        patients: patientsByCampId[cId] || [] // Agar us camp mein patient nahi hai toh empty array
      };
    });

    console.log(`✅ Found ${campsWithPatients.length} camps for ${employeeName}`);

    // 7. Response bhejo
    res.status(200).json({
      success: true,
      count: campsWithPatients.length,
      message: `Camps and patients fetched successfully for ${employeeName}`,
      data: campsWithPatients
    });

  } catch (error) {
    console.log("❌ GET ASSIGNED CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned camps",
      error: error.message
    });
  }
};



// Helper: Camp Status nikalne ke liye
const getCampStatus = (date, time) => {
  if (!date) return "upcoming";
  const now = new Date();
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const campDate = new Date(date);
  campDate.setHours(0,0,0,0);

  if (campDate.getTime() === today.getTime()) {
    // Agar aaj ka hai, toh check karo time nikal gaya kya (roughly)
    return "today"; 
  }
  if (campDate > today) return "upcoming";
  return "completed";
};

// =============================================
// GET VOLUNTEER DASHBOARD (Only Stats & Charts)
// =============================================
export const getVolunteerDashboard = async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName || employeeName.trim() === "") {
      return res.status(400).json({ success: false, message: "employeeName is required" });
    }

    const escapedName = employeeName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1. Fetch Camps
    const camps = await Camp.find({
      volunteers: { $regex: new RegExp(`^${escapedName}$`, "i") }
    }).lean();

    if (!camps || camps.length === 0) {
      return res.status(200).json({
        success: true,
        stats: { totalCamps: 0, activeCamps: 0, upcomingCamps: 0, totalPatients: 0, screenedPatients: 0 },
        charts: {
          campDistribution: { live: 0, today: 0, upcoming: 0, completed: 0 },
          campParticipation: [],
          bmiDistribution: [],
          healthMetrics: { bp: [], sugar: [] }
        }
      });
    }

    // 2. Fetch Patients (sirf ID, tests aur vitals taaki light rahe)
    const campIds = camps.map(c => c._id);
    const patients = await Patient.find({ campId: { $in: campIds } })
      .select('campId tests vitals')
      .lean();

    // 3. Variables Setup
    let liveCount = 0, todayCount = 0, upcomingCount = 0, completedCount = 0;
    let bmiCount = { Underweight: 0, Healthy: 0, Overweight: 0, Obese: 0 };
    let bpCount = { Normal: 0, Elevated: 0, High: 0 };
    let sugarCount = { Normal: 0, Borderline: 0, High: 0 };
    let participationData = [];

    // 4. Camp Stats & Participation Calculate karo
    camps.forEach(camp => {
      const status = getCampStatus(camp.date, camp.time);
      if (status === 'today') todayCount++;
      else if (status === 'upcoming') upcomingCount++;
      else if (status === 'completed') completedCount++;
      // Filhal 'live' ka koi proper logic nahi hai, toh 0 hi rakh rahe hain
      
      const cPatients = patients.filter(p => String(p.campId) === String(camp._id));
      
      participationData.push({
        campName: camp.name,
        patients: cPatients.length,
        screened: cPatients.filter(p => p.tests && p.tests.length > 0).length
      });
    });

    // 5. Health Metrics Calculate karo (Har patient ka latest data)
    patients.forEach(p => {
      // BMI Chart
      if (p.vitals && p.vitals.bmiCategory) {
        if (bmiCount[p.vitals.bmiCategory] !== undefined) {
          bmiCount[p.vitals.bmiCategory]++;
        }
      }

      // BP & Sugar Chart
      if (p.tests && p.tests.length > 0) {
        // Reverse karke latest test nikaalo
        const reversedTests = [...p.tests].reverse();

        const lastBp = reversedTests.find(t => t.type === 'bp');
        if (lastBp && lastBp.value && lastBp.value2) {
          if (lastBp.value > 140 || lastBp.value2 > 90) bpCount.High++;
          else if (lastBp.value > 120 || lastBp.value2 > 80) bpCount.Elevated++;
          else bpCount.Normal++;
        }

        const lastSugar = reversedTests.find(t => t.type === 'sugar');
        if (lastSugar && lastSugar.value) {
          if (lastSugar.value > 200) sugarCount.High++;
          else if (lastSugar.value > 140) sugarCount.Borderline++;
          else sugarCount.Normal++;
        }
      }
    });

    const screenedPatientsCount = patients.filter(p => p.tests && p.tests.length > 0).length;

    // 6. Charts ka Array Format (Recharts/Chart.js ke liye ready)
    const bmiChartData = [
      { name: "Underweight", value: bmiCount.Underweight },
      { name: "Healthy", value: bmiCount.Healthy },
      { name: "Overweight", value: bmiCount.Overweight },
      { name: "Obese", value: bmiCount.Obese },
    ];

    const bpChartData = [
      { name: "Normal", value: bpCount.Normal },
      { name: "Elevated", value: bpCount.Elevated },
      { name: "High", value: bpCount.High },
    ];

    const sugarChartData = [
      { name: "Normal", value: sugarCount.Normal },
      { name: "Borderline", value: sugarCount.Borderline },
      { name: "High", value: sugarCount.High },
    ];

    // 7. Final Response
    res.status(200).json({
      success: true,
      data: {
        // Top Cards
        stats: {
          totalCamps: camps.length,
          activeCamps: todayCount, // Active = aaj ke camps
          upcomingCamps: upcomingCount,
          totalPatients: patients.length,
          screenedPatients: screenedPatientsCount
        },
        
        // Charts Data
        charts: {
          campDistribution: {
            live: liveCount,
            today: todayCount,
            upcoming: upcomingCount,
            completed: completedCount
          },
          campParticipation: participationData,
          bmiDistribution: bmiChartData,
          healthMetrics: {
            bp: bpChartData,
            sugar: sugarChartData
          }
        }
      }
    });

  } catch (error) {
    console.error("❌ DASHBOARD API ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data", error: error.message });
  }
};
