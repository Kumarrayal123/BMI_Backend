import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    lead: {
      id: { type: mongoose.Schema.Types.Mixed, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    },
    members: [
      {
        id: { type: mongoose.Schema.Types.Mixed, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Team", teamSchema);
