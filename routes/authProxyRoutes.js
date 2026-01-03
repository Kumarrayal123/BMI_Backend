import express from "express";
import axios from "axios";

const router = express.Router();

const ATTENDANCE_BACKEND = "https://attendancebackend-5cgn.onrender.com/api";

/* =========================================
   PROXY: Employee Login
   ========================================= */
router.post("/employees/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Forward the request to the attendance backend
        const response = await axios.post(`${ATTENDANCE_BACKEND}/employees/login`, {
            email,
            password
        });

        // Return the response from attendance backend
        res.status(200).json(response.data);

    } catch (err) {
        console.error("Employee Login Proxy Error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Login failed" }
        );
    }
});

/* =========================================
   PROXY: Admin Login
   ========================================= */
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Forward the request to the attendance backend
        const response = await axios.post(`${ATTENDANCE_BACKEND}/admin/login`, {
            email,
            password
        });

        // Return the response from attendance backend
        res.status(200).json(response.data);

    } catch (err) {
        console.error("Admin Login Proxy Error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Login failed" }
        );
    }
});

export default router;
