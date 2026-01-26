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
   PROXY: Get Employees
   ========================================= */
router.get("/employees/get-employees", async (req, res) => {
    try {
        console.log(`[PROXY] Fetching employees from: ${ATTENDANCE_BACKEND}/employees/get-employees`);
        // Forward the request to the attendance backend
        const response = await axios.get(`${ATTENDANCE_BACKEND}/employees/get-employees`);

        console.log(`[PROXY] Response Status: ${response.status}`);
        const dataLength = Array.isArray(response.data) ? response.data.length : (response.data?.employees?.length || response.data?.data?.length || 0);
        console.log(`[PROXY] Successfully fetched ${dataLength} employees`);

        // Return the response from attendance backend
        res.status(200).json(response.data);

    } catch (err) {
        console.error("[PROXY] Get Employees Error:", err.response?.data || err.message);
        console.error("[PROXY] Status Code:", err.response?.status);
        res.status(err.response?.status || 500).json(
            err.response?.data || { message: "Failed to fetch employees" }
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
