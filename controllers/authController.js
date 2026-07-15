// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import axios from "axios";

// /* =========================================
//    REGISTER
//    ========================================= */
// export const register = async (req, res) => {
//     try {
//         const { name, email, password, mobile, address, role, clinicName } = req.body;

//         const normalizedEmail = email.toLowerCase().trim();

//         // Check existing user
//         const existingUser = await User.findOne({ email: normalizedEmail });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists with this email" });
//         }

//         // Role validation
//         if (role === "partner" && !clinicName) {
//             return res.status(400).json({ message: "Clinic Name is required for Partners" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             mobile,
//             address,
//             role: role || "user",
//             clinicName: role === "partner" ? clinicName : undefined,
//         });

//         await newUser.save();

//         res.status(201).json({
//             message: "User registered successfully", user: {
//                 id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role
//             }
//         });

//     } catch (err) {
//         console.error("Register Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// /* =========================================
//    LOGIN
//    ========================================= */
// export const login = async (req, res) => {
//     try {
//         console.log("Login Request Body:", req.body);
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         const normalizedEmail = email.toLowerCase().trim();

//         // Find user
//         const user = await User.findOne({ email: normalizedEmail });
//         if (!user) {
//             console.log(`User not found: ${normalizedEmail}`);
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check password
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate Token (simple secret for now, ideally in .env)
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || "supersecretkey123",
//             { expiresIn: "1d" }
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 clinicName: user.clinicName
//             }
//         });

//     } catch (err) {
//         console.error("Login Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// /* =========================================
//    UNIFIED LOGIN (Avoids frontend Promise.any 404 errors)
//    ========================================= */
// export const unifiedLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) return res.status(400).json({ message: "Email and password required" });
        
//         const normalizedEmail = email.toLowerCase().trim();

//         // 1. Try Local Partner/User
//         const user = await User.findOne({ email: normalizedEmail });
//         if (user) {
//             const isPasswordCorrect = await bcrypt.compare(password, user.password);
//             if (isPasswordCorrect) {
//                 const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "supersecretkey123", { expiresIn: "1d" });
//                 return res.status(200).json({ type: "partner", data: { message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role, clinicName: user.clinicName } } });
//             }
//         }

//         const ATTENDANCE_BACKEND = "https://api.timelyhealth.in/api";

//         // 2. Try Employee
//         try {
//             const empRes = await axios.post(`${ATTENDANCE_BACKEND}/employees/login`, { email, password });
//             if (empRes.data) return res.status(200).json({ type: "employee", data: empRes.data });
//         } catch (e) { /* ignore */ }

//         // 3. Try Admin
//         try {
//             const admRes = await axios.post(`${ATTENDANCE_BACKEND}/admin/login`, { email, password });
//             if (admRes.data) return res.status(200).json({ type: "admin", data: admRes.data });
//         } catch (e) { /* ignore */ }

//         // If all fail
//         return res.status(401).json({ message: "Invalid Email or Password" });
        
//     } catch (err) {
//         console.error("Unified Login Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// /* =========================================
//    GET ALL PARTNERS
//    ========================================= */
// export const getAllPartners = async (req, res) => {
//     try {
//         console.log("Fetching partners...");
//         const partners = await User.find({ role: { $in: ["partner", "user"] } }).select("-password");
//         console.log(`Found ${partners.length} partners.`);
//         res.status(200).json(partners);
//     } catch (err) {
//         console.error("Get Partners Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


// /* =========================================
//    UPDATE PARTNER
//    ========================================= */
// export const updatePartner = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const {
//             name,
//             email,
//             mobile,
//             address,
//             clinicName,
//             password
//         } = req.body;

//         // Check Partner
//         const partner = await User.findById(id);

//         if (!partner) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Partner not found"
//             });
//         }

//         // Check duplicate email
//         if (email && email !== partner.email) {
//             const emailExists = await User.findOne({
//                 email: email.toLowerCase().trim(),
//                 _id: { $ne: id }
//             });

//             if (emailExists) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Email already exists"
//                 });
//             }

//             partner.email = email.toLowerCase().trim();
//         }

//         if (name) partner.name = name;
//         if (mobile) partner.mobile = mobile;
//         if (address) partner.address = address;
//         if (clinicName) partner.clinicName = clinicName;

//         // Password update (optional)
//         if (password && password.trim() !== "") {
//             partner.password = await bcrypt.hash(password, 12);
//         }

//         await partner.save();

//         res.status(200).json({
//             success: true,
//             message: "Partner updated successfully",
//             data: partner
//         });

//     } catch (err) {
//         console.error("Update Partner Error:", err);
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import axios from "axios";

/* =========================================
   REGISTER
   ========================================= */
export const register = async (req, res) => {
    try {
        const { name, email, password, mobile, address, role, clinicName } = req.body;

        const normalizedEmail = email.toLowerCase().trim();

        // Check existing user
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Role validation
        if (role === "partner" && !clinicName) {
            return res.status(400).json({ message: "Clinic Name is required for Partners" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            address,
            role: role || "user",
            clinicName: role === "partner" ? clinicName : undefined,
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully", user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* =========================================
   LOGIN
   ========================================= */
export const login = async (req, res) => {
    try {
        console.log("Login Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`User not found: ${normalizedEmail}`);
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate Token (simple secret for now, ideally in .env)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "supersecretkey123",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                clinicName: user.clinicName
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* =========================================
   UNIFIED LOGIN (Avoids frontend Promise.any 404 errors)
   ========================================= */
export const unifiedLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("📨 Login Request:", { email });
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        
        const normalizedEmail = email.toLowerCase().trim();

        // ============================================
        // 1️⃣ PEHLE DATABASE MEIN CHECK KARO (Sabse Important)
        // ============================================
        const user = await User.findOne({ email: normalizedEmail });
        
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                const token = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET || "supersecretkey123",
                    { expiresIn: "1d" }
                );
                
                console.log("✅ DATABASE LOGIN SUCCESS:", user.email, "Role:", user.role);
                
                // EMPLOYEE
                if (user.role === "employee") {
                    return res.status(200).json({
                        type: "employee",
                        data: {
                            message: "Login successful",
                            token,
                            employee: {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                department: user.department || ""
                            }
                        }
                    });
                }
                
                // ADMIN
                if (user.role === "admin") {
                    return res.status(200).json({
                        type: "admin",
                        data: {
                            message: "Login successful",
                            token,
                            admin: {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role
                            }
                        }
                    });
                }
                
                // PARTNER
                return res.status(200).json({
                    type: "partner",
                    data: {
                        message: "Login successful",
                        token,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            clinicName: user.clinicName
                        }
                    }
                });
            }
        }

        // ============================================
        // 2️⃣ AGAR DATABASE MEIN NAHI MILA TOH EXTERNAL API
        // ============================================
        const ATTENDANCE_BACKEND = "https://api.timelyhealth.in/api";

        // Try Employee API - SIRF ISME CHANGE KARO
        try {
            console.log("🔄 Trying Employee API...");
            
            // ✅ FIX: Default location add karo
            const empPayload = { 
                email: normalizedEmail, 
                password,
                latitude: 0,
                longitude: 0
            };
            
            const empRes = await axios.post(`${ATTENDANCE_BACKEND}/employees/login`, empPayload);
            if (empRes.data) {
                console.log("✅ Employee API Success");
                return res.status(200).json({ type: "employee", data: empRes.data });
            }
        } catch (e) { 
            console.log("❌ Employee API Failed:", e.response?.data?.message || e.message);
        }

        // Try Admin API
        try {
            console.log("🔄 Trying Admin API...");
            const admRes = await axios.post(`${ATTENDANCE_BACKEND}/admin/login`, { 
                email: normalizedEmail, 
                password 
            });
            if (admRes.data) {
                console.log("✅ Admin API Success");
                return res.status(200).json({ type: "admin", data: admRes.data });
            }
        } catch (e) { 
            console.log("❌ Admin API Failed:", e.response?.data?.message || e.message);
        }

        // ============================================
        // 3️⃣ SAB FAIL
        // ============================================
        console.log("❌ ALL FAILED:", normalizedEmail);
        return res.status(401).json({ 
            message: "Invalid Email or Password" 
        });
        
    } catch (err) {
        console.error("❌ Unified Login Error:", err);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};

/* =========================================
   GET ALL PARTNERS
   ========================================= */
export const getAllPartners = async (req, res) => {
    try {
        console.log("Fetching partners...");
        const partners = await User.find({ role: "partner" }).select("-password");
        console.log(`Found ${partners.length} partners.`);
        res.status(200).json(partners);
    } catch (err) {
        console.error("Get Partners Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* =========================================
   UPDATE PARTNER
   ========================================= */
export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            mobile,
            address,
            clinicName,
            password
        } = req.body;

        const partner = await User.findById(id);

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found"
            });
        }

        if (email && email !== partner.email) {
            const emailExists = await User.findOne({
                email: email.toLowerCase().trim(),
                _id: { $ne: id }
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            partner.email = email.toLowerCase().trim();
        }

        if (name) partner.name = name;
        if (mobile) partner.mobile = mobile;
        if (address) partner.address = address;
        if (clinicName) partner.clinicName = clinicName;

        if (password && password.trim() !== "") {
            partner.password = await bcrypt.hash(password, 12);
        }

        await partner.save();

        res.status(200).json({
            success: true,
            message: "Partner updated successfully",
            data: partner
        });

    } catch (err) {
        console.error("Update Partner Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};