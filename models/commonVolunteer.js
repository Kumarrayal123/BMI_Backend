import mongoose from "mongoose";

const commonVolunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    campName: {
      type: String,
      required: true,
      trim: true,
    },
    campLocation: {
      type: String,
      required: true,
      trim: true,
    },
    campDate: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      default: "Camp Volunteer",
    },
    status: {
      type: String,
      default: "Confirmed",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
    collection: "commmonVolunteers" // Specified collection name
  }
);

export default mongoose.model("CommonVolunteer", commonVolunteerSchema);
