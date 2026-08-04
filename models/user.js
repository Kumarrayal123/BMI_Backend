import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: function () {
                return this.role === "partner" || this.role === "user";
            }
        },
        mobile: {
            type: String,
            required: function () {
                return this.role === "partner" || this.role === "user";
            }
        },
        address: {
            type: String,
            required: function () {
                return this.role === "partner" || this.role === "user";
            }
        },
        role: {
            type: String,
            enum: ["partner", "user", "admin", "employee"],
            default: "user"
        },
        // Partner specific fields
        clinicName: {
            type: String,
            required: function () {
                return this.role === "partner";
            }
        },
        canManageVolunteers: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
