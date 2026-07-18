// import mongoose from "mongoose";

// const campSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true   // Camp-1, Camp-2
//     },
//     location: {
//       type: String,
//       required: true   // Tolichowki
//     },
//     address: String,
//     date: String,      // 12-12-2025
//     time: String,      // 10:00 AM - 4:00 PM
//     volunteers: {
//       type: [String],
//       default: []
//     },
//     partners: [{
//       partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
//     }]
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Camp", campSchema);

// import mongoose from "mongoose";
// const campSchema = new mongoose.Schema({

//     name: String,
//     location: String,
//     address: String,
//     date: String,
//     time: String,

//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },

//     creatorRole: {
//         type: String,
//         enum: ["admin", "partner"]
//     },

//     assignedPartner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//     },

//     assignedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//     },

//     partnerAssignedAt: {
//         type: Date,
//         default: null
//     },

//     volunteers: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }],

//     partnerRequest: {
//         requested: {
//             type: Boolean,
//             default: false
//         },

//         requestedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null
//         },

//         status: {
//             type: String,
//             enum: ["pending", "approved", "rejected"],
//             default: "pending"
//         }
//     },

//     status: {
//         type: String,
//         enum: ["active", "completed", "cancelled"],
//         default: "active"
//     }

// }, {
//     timestamps: true
// });
// export default mongoose.model("Camp", campSchema);

// import mongoose from "mongoose";

// const campSchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     address: String,
//     date: String,
//     time: String,

//     // 🔥 Mixed - ID aur String dono allow karega
//     createdBy: {
//         type: mongoose.Schema.Types.Mixed,
//         default: null
//     },

//     creatorRole: {
//         type: String,
//         enum: ["admin", "partner"]
//     },

//     assignedPartner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//     },

//     assignedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null
//     },

//     partnerAssignedAt: {
//         type: Date,
//         default: null
//     },

//     // 🔥 Mixed - ID aur String dono allow karega
//     volunteers: [{
//         type: mongoose.Schema.Types.Mixed
//     }],

//     partnerRequest: {
//         requested: {
//             type: Boolean,
//             default: false
//         },
//         requestedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null
//         },
//         status: {
//             type: String,
//             enum: ["pending", "approved", "rejected"],
//             default: "pending"
//         }
//     },

//     status: {
//         type: String,
//         enum: ["active", "completed", "cancelled"],
//         default: "active"
//     }

// }, {
//     timestamps: true
// });

// export default mongoose.model("Camp", campSchema);

import mongoose from "mongoose";

const campSchema = new mongoose.Schema({
    name: String,
    location: String,
    address: String,
    date: String,
    time: String,

    // 🔥 Mixed - ID aur String dono allow karega
    createdBy: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    creatorRole: {
        type: String,
        enum: ["admin", "partner"]
    },

    assignedPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    partnerAssignedAt: {
        type: Date,
        default: null
    },

    // 🔥 Mixed - ID aur String dono allow karega
    volunteers: [{
        type: mongoose.Schema.Types.Mixed
    }],

    // Partners field (Mixed - supports both ID and String)
    partners: [{
        type: mongoose.Schema.Types.Mixed
    }],

    partnerRequest: {
        requested: {
            type: Boolean,
            default: false
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },

    // ✅ isHidden field - for archiving
    isHidden: {
        type: Boolean,
        default: false
    },

    // ✅ status - "archived" added to enum
    status: {
        type: String,
        enum: ["active", "completed", "cancelled", "archived"],
        default: "active"
    }

}, {
    timestamps: true
});

export default mongoose.model("Camp", campSchema);