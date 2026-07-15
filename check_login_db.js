import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import User from "./models/user.js";

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Migrate existing "user" roles to "partner"
        const updateResult = await User.updateMany(
            { role: "user" },
            { $set: { role: "partner", clinicName: "BIM Clinic" } }
        );
        console.log("Migration result:", updateResult);

        const users = await User.find({});

        let output = "=== DATABASE USER LIST ===\n";
        users.forEach((u, i) => {
            output += `[${i + 1}] ${JSON.stringify(u)}\n`;
        });

        fs.writeFileSync("user_check_output.txt", output);
        console.log("Results written to user_check_output.txt");

        await mongoose.disconnect();
    } catch (err) {
        fs.writeFileSync("user_check_output.txt", "DB Error: " + err.message);
    }
}

checkUsers();
