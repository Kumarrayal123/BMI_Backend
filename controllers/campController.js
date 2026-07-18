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
      volunteers
    } = req.body;

    console.log("📥 Creating camp - Received:", {
      name,
      location,
      date,
      time,
      createdBy,
      creatorRole,
      volunteers
    });

    if (!name || !location || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, Location, Date and Time are required."
      });
    }

    // 🔥 FIX: Handle volunteers - ID aur String dono support
    let volunteerData = [];
    if (volunteers && Array.isArray(volunteers)) {
      volunteerData = volunteers.map(v => {
        // Agar valid ObjectId hai toh ObjectId store karo
        if (mongoose.Types.ObjectId.isValid(v) && String(v).length === 24) {
          return new mongoose.Types.ObjectId(v);
        }
        // Warna string store karo
        return String(v).trim();
      });
    } else if (typeof volunteers === 'string') {
      volunteerData = [String(volunteers).trim()];
    }

    // 🔥 FIX: Handle createdBy - ID aur String dono support
    let createdByData = null;
    if (createdBy) {
      // Agar valid ObjectId hai toh ObjectId store karo
      if (mongoose.Types.ObjectId.isValid(createdBy) && String(createdBy).length === 24) {
        createdByData = new mongoose.Types.ObjectId(createdBy);
      } else {
        // Warna string store karo
        createdByData = String(createdBy).trim();
      }
    }

    console.log("✅ Processed:", { createdByData, volunteerData });

    let assignedPartnerData = null;
    if (creatorRole === "admin") {
      assignedPartnerData = assignedPartner ? (mongoose.Types.ObjectId.isValid(assignedPartner) && String(assignedPartner).length === 24 ? new mongoose.Types.ObjectId(assignedPartner) : String(assignedPartner).trim()) : null;
    } else if (creatorRole === "partner") {
      assignedPartnerData = createdByData;
    }

    let partnerData = [];
    if (assignedPartnerData) {
      partnerData.push(assignedPartnerData);
    }
    if (req.body.partners && Array.isArray(req.body.partners)) {
      req.body.partners.forEach(p => {
        const pVal = mongoose.Types.ObjectId.isValid(p) && String(p).length === 24 ? new mongoose.Types.ObjectId(p) : String(p).trim();
        if (String(pVal) !== String(assignedPartnerData)) {
          partnerData.push(pVal);
        }
      });
    }

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
        
        // Ensure the creator partner is in partners list
        if (createdByData) {
            const creatorStr = String(createdByData);
            const exists = partnerData.some(p => String(p) === creatorStr);
            if (!exists) {
                partnerData.push(createdByData);
            }
        }

        // ✅ IMPORTANT: assignedPartner ko createdBy se set karo
        const camp = await Camp.create({
            name,
            location,
            address: address || "",
            date,
            time,
            createdBy: createdByData,
            creatorRole: "partner",
            assignedPartner: createdByData, // ✅ YEH SET KARO
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
      camp.assignedPartner = assignedPartner;
      if (assignedPartner) {
        let partnerData = [];
        const pVal = mongoose.Types.ObjectId.isValid(assignedPartner) && String(assignedPartner).length === 24 ? new mongoose.Types.ObjectId(assignedPartner) : String(assignedPartner).trim();
        partnerData.push(pVal);
        
        // Merge with existing partners if any, keeping assignedPartner first
        if (req.body.partners && Array.isArray(req.body.partners)) {
          req.body.partners.forEach(p => {
            const pValOther = mongoose.Types.ObjectId.isValid(p) && String(p).length === 24 ? new mongoose.Types.ObjectId(p) : String(p).trim();
            if (String(pValOther) !== String(pVal)) {
              partnerData.push(pValOther);
            }
          });
        }
        camp.partners = partnerData;
      } else {
        camp.partners = [];
      }
    }

    // 🔥 FIX: Handle volunteers - ID aur String dono support
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
    console.log("UPDATE CAMP BY ADMIN ERROR:", error);
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
      status
    } = req.body;

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    // 🔥 FIX: createdBy ab Mixed hai, isliye String comparison karo
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

    // 🔥 FIX: Handle volunteers - ID aur String dono support
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
    console.log("UPDATE CAMP BY PARTNER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================================================
   GET ASSIGNED CAMPS
=========================================================== */
export const getAssignedCamps = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!partnerId || partnerId === "null" || partnerId === "undefined") {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    let queryConditions = [
      { assignedPartner: partnerId },
      { partners: partnerId }
    ];
    if (mongoose.Types.ObjectId.isValid(partnerId) && String(partnerId).length === 24) {
      const objId = new mongoose.Types.ObjectId(partnerId);
      queryConditions.push({ assignedPartner: objId });
      queryConditions.push({ partners: objId });
    }

    const camps = await Camp.find({
      $or: queryConditions
    })
      .populate("assignedPartner", "name clinicName role")
      .populate({ path: "createdBy", model: "User", select: "name clinicName role" })
      .populate({ path: "partners", model: "User", select: "name clinicName role" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });

  } catch (error) {
    console.log("GET ASSIGNED CAMPS ERROR:", error);
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
    const camps = await Camp.find()
      .populate("assignedPartner", "name clinicName role")
      .populate({ path: "createdBy", model: "User", select: "name clinicName role" })
      .populate({ path: "partners", model: "User", select: "name clinicName role" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });

  } catch (error) {
    console.log("GET ALL CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPartnerCreatedCamps = async (req, res) => {
  try {

    const { partnerId } = req.params;

    console.log("========== PARTNER CREATED CAMPS ==========");
    console.log("PartnerId From URL:", partnerId);

    // Total camps
    const total = await Camp.countDocuments();
    console.log("Total Camps:", total);

    // Check specific camp
    const sampleCamp = await Camp.findById("6a4238b471e06b1eb88b369d");
    console.log("Sample Camp:", sampleCamp);

    if (sampleCamp) {
      console.log("DB createdBy:", sampleCamp.createdBy);
      console.log("DB createdBy String:", String(sampleCamp.createdBy));
      console.log("creatorRole:", sampleCamp.creatorRole);
    }

    // Find only by createdBy
    const byCreatedBy = await Camp.find({
      createdBy: new mongoose.Types.ObjectId(partnerId)
    });

    console.log("Found by createdBy:", byCreatedBy.length);
    console.log(byCreatedBy);

    let queryConditions = [ { createdBy: partnerId } ];
    if (mongoose.Types.ObjectId.isValid(partnerId) && String(partnerId).length === 24) {
      queryConditions.push({ createdBy: new mongoose.Types.ObjectId(partnerId) });
    }

    // Find by createdBy + creatorRole
    const camps = await Camp.find({
      $or: queryConditions,
      creatorRole: "partner"
    })
      .populate("assignedPartner", "name clinicName role")
      .populate({ path: "createdBy", model: "User", select: "name clinicName role" })
      .populate({ path: "partners", model: "User", select: "name clinicName role" })
      .sort({ createdAt: -1 });

    console.log("Final Result:", camps.length);
    console.log(camps);

    return res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });

  } catch (error) {
    console.log("GET PARTNER CREATED CAMPS ERROR:", error);

    return res.status(500).json({
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
    console.log("DELETE CAMP BY ADMIN ERROR:", error);
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

    const camp = await Camp.findById(campId);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found"
      });
    }

    // 🔥 FIX: createdBy ab Mixed hai, isliye String comparison karo
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
    console.log("DELETE CAMP BY PARTNER ERROR:", error);
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

    // ✅ ONLY update isHidden - DO NOT change status
    camp.isHidden = isHidden !== undefined ? isHidden : true;

    await camp.save();

    console.log(`✅ Camp ${campId} ${camp.isHidden ? 'hidden' : 'unhidden'} successfully`);

    res.status(200).json({
      success: true,
      message: camp.isHidden ? "Camp archived successfully" : "Camp restored successfully",
      data: camp
    });

  } catch (error) {
    console.log("HIDE CAMP ERROR:", error);
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

    // ✅ ONLY set isHidden to false - DO NOT change status
    camp.isHidden = false;

    await camp.save();

    console.log(`✅ Camp ${campId} restored successfully`);

    res.status(200).json({
      success: true,
      message: "Camp restored successfully",
      data: camp
    });

  } catch (error) {
    console.log("UNHIDE CAMP ERROR:", error);
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

    // Find camps older than cutoff date that are not already hidden
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
        // ✅ ONLY set isHidden to true - DO NOT change status
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
    console.log("ARCHIVE OLD CAMPS ERROR:", error);
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
      .populate("assignedPartner", "name clinicName role")
      .populate({ path: "createdBy", model: "User", select: "name clinicName role" })
      .populate({ path: "partners", model: "User", select: "name clinicName role" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });

  } catch (error) {
    console.log("GET ARCHIVED CAMPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};