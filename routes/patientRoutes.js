


// import express from 'express';
// import Patient from '../models/patient.js';

// const router = express.Router();

// /* -----------------------------------------------------
//   BMI CALCULATION FUNCTION
// ------------------------------------------------------ */
// const calculateBMI = (weight, height) => {
//     if (!weight || !height) return null;
//     const h = height / 100;
//     return (weight / (h * h)).toFixed(1);
// };

// const getBMICategory = (bmi) => {
//     if (!bmi) return "N/A";

//     const b = parseFloat(bmi);

//     if (b < 18.5) return "Underweight";
//     if (b < 25) return "Healthy";
//     if (b < 30) return "Overweight";
//     if (b < 35) return "Obese";
//     return "Extremely Obese";
// };

// /* -----------------------------------------------------
//   1. GET ALL PATIENTS
// ------------------------------------------------------ */
// router.get('/', async (req, res) => {
//     try {
//         const patients = await Patient.find().sort({ createdAt: -1 });

//         const data = patients.map(p => ({
//             _id: p._id,
//             name: p.name,
//             age: p.age,
//             gender: p.gender,
//             contact: p.contact,
//             testCount: p.tests.length,
//             lastTest: p.tests[p.tests.length - 1]?.date || null
//         }));

//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* -----------------------------------------------------
//   2. GET SINGLE PATIENT
// ------------------------------------------------------ */
// router.get('/:id', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.id);
//         if (!patient) return res.status(404).json({ error: "Patient not found" });
//         res.json(patient);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* -----------------------------------------------------
//   3. CREATE PATIENT
// ------------------------------------------------------ */
// router.post('/', async (req, res) => {
//     try {
//         const patient = new Patient({
//             name: req.body.name,
//             age: req.body.age,
//             gender: req.body.gender,
//             contact: req.body.contact,
//             address: req.body.address,
//             tests: []
//         });

//         const saved = await patient.save();
//         res.status(201).json(saved);

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// /* -----------------------------------------------------
//   4. ADD TEST (WEIGHT / HEIGHT / SUGAR / BP)
// ------------------------------------------------------ */

// router.post('/:id/test', async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) return res.status(404).json({ error: "Patient not found" });

//     const { type, value, value2, sugarType } = req.body;

//     if (!type || value === undefined) {
//       return res.status(400).json({ error: "Invalid test data" });
//     }

//     // --------------------
//     // SAVE TEST HISTORY
//     // --------------------
//     const newTest = {
//       type,
//       value: parseFloat(value),
//       date: new Date()
//     };

//     if (type === "bp") {
//       if (!value2) {
//         return res.status(400).json({ error: "Diastolic value required" });
//       }
//       newTest.value2 = parseInt(value2);
//       newTest.unit = "mmHg";
//     }

//     if (type === "weight") newTest.unit = "kg";
//     if (type === "height") newTest.unit = "cm";
//     if (type === "sugar") {
//       newTest.unit = "mg/dL";
//       newTest.sugarType = sugarType || "Random";
//     }

//     patient.tests.push(newTest);

//     // --------------------
//     // UPDATE CURRENT VITALS ✅
//     // --------------------
//     if (!patient.vitals) patient.vitals = {};

//     if (type === "weight") patient.vitals.weight = newTest.value;
//     if (type === "height") patient.vitals.height = newTest.value;
//     if (type === "sugar") {
//       patient.vitals.sugar = newTest.value;
//       patient.vitals.sugarType = newTest.sugarType;
//     }
//     if (type === "bp") {
//       patient.vitals.bpSys = newTest.value;
//       patient.vitals.bpDia = newTest.value2;
//     }

//     // --------------------
//     // AUTO BMI (FROM VITALS)
//     // --------------------
//     const { weight, height } = patient.vitals;

//     if (weight && height) {
//       const h = height / 100;
//       const bmi = (weight / (h * h)).toFixed(1);

//       let category = "Healthy";
//       if (bmi < 18.5) category = "Underweight";
//       else if (bmi >= 25 && bmi < 30) category = "Overweight";
//       else if (bmi >= 30) category = "Obese";

//       patient.vitals.bmi = parseFloat(bmi);
//       patient.vitals.bmiCategory = category;
//     }

//     patient.vitals.updatedAt = new Date();

//     await patient.save();

//     res.json({
//       message: "Test added successfully",
//       vitals: patient.vitals
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -----------------------------------------------------
//   5. GET ALL TESTS OF PATIENT
// ------------------------------------------------------ */
// router.get('/:id/tests', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.id);
//         if (!patient) return res.status(404).json({ error: "Patient not found" });

//         res.json(patient.tests);

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* -----------------------------------------------------
//   6. DELETE PATIENT
// ------------------------------------------------------ */
// router.delete('/:id', async (req, res) => {
//     try {
//         await Patient.findByIdAndDelete(req.params.id);
//         res.json({ message: "Patient deleted" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* -----------------------------------------------------
//   7. DOCTOR VERIFICATION
// ------------------------------------------------------ */
// // router.patch('/:id/tests/:testId/verify', async (req, res) => {
// //     console.log('=== PATCH /verify request ===');
// //     console.log('Patient ID:', req.params.id);
// //     console.log('Test ID:', req.params.testId);

// //     const maxRetries = 3;
// //     let attempt = 0;

// //     while (attempt < maxRetries) {
// //         try {
// //             const patient = await Patient.findById(req.params.id);
// //             if (!patient) {
// //                 console.error('Patient not found:', req.params.id);
// //                 return res.status(404).json({ error: "Patient not found" });
// //             }

// //             console.log('Patient found:', patient.name);
// //             console.log('Total tests:', patient.tests.length);

// //             const test = patient.tests.id(req.params.testId);
// //             if (!test) {
// //                 console.error('Test not found:', req.params.testId);
// //                 console.log('Available test IDs:', patient.tests.map(t => t._id.toString()));
// //                 return res.status(404).json({ error: "Test not found" });
// //             }

// //             console.log('Test found:', test.type, test.value);
// //             console.log('Current verification status:', test.doctorVerification);

// //             test.doctorVerification = {
// //                 status: "approved",
// //                 approvedBy: req.body.doctor || "Doctor",
// //                 approvedAt: new Date()
// //             };

// //             console.log('Updated verification:', test.doctorVerification);
// //             console.log('Attempting to save patient...');

// //             await patient.save();

// //             console.log('Patient saved successfully!');
// //             return res.json({ message: "Verified", patient });

// //         } catch (err) {
// //             console.error('=== ERROR in PATCH /verify ===');
// //             console.error('Error name:', err.name);
// //             console.error('Error message:', err.message);
// //             console.error('Stack:', err.stack);

// //             // Check if it's a version conflict error
// //             if (err.name === 'VersionError' || (err.message && err.message.includes('version'))) {
// //                 attempt++;
// //                 console.log(`Version conflict detected, retry attempt ${attempt}/${maxRetries}`);

// //                 if (attempt >= maxRetries) {
// //                     console.error("Max retries reached for version conflict");
// //                     return res.status(500).json({ error: "Failed to verify due to concurrent updates. Please try again." });
// //                 }

// //                 await new Promise(resolve => setTimeout(resolve, 100 * attempt));
// //                 continue;
// //             }

// //             // For other errors, return immediately
// //             console.error('Returning 500 error to client');
// //             return res.status(500).json({ error: err.message });
// //         }
// //     }

// //     // Fallback
// //     console.error('WARNING: While loop exited without return!');
// //     return res.status(500).json({ error: "Unexpected error" });
// // });


// router.patch('/:id/tests/:testId/verify', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.id);
//         if (!patient) {
//             return res.status(404).json({ error: "Patient not found" });
//         }

//         const test = patient.tests.id(req.params.testId);
//         if (!test) {
//             return res.status(404).json({ error: "Test not found" });
//         }

//         test.doctorVerification = {
//             status: "approved",
//             approvedBy: req.body?.doctor || "Doctor", // ✅ FIXED
//             approvedAt: new Date()
//         };

//         await patient.save();

//         res.json({ message: "Test verified successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });


// export default router;

import express from "express";
import Camp from "../models/camp.js";
import Patient from "../models/patient.js";

const router = express.Router();

/* -----------------------------------------------------
  BMI CALCULATION FUNCTIONS
------------------------------------------------------ */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
};

const getBMICategory = (bmi) => {
  if (!bmi) return "N/A";
  const b = parseFloat(bmi);

  if (b < 18.5) return "Underweight";
  if (b < 25) return "Healthy";
  if (b < 30) return "Overweight";
  if (b < 35) return "Obese";
  return "Extremely Obese";
};

/* -----------------------------------------------------
  1️⃣ GET ALL PATIENTS (✅ FIXED: Added reportPdfUrl)
------------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("campId", "name location")
      .select("+reportPdfUrl")
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// =============================================
// GET ASSIGNED PATIENTS FOR VOLUNTEER (By employeeName)
// =============================================
router.get("/assignedpatients", async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName || employeeName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "employeeName query parameter is required"
      });
    }

    console.log(`🔄 Fetching patients for employee: ${employeeName}`);

    const escapedName = employeeName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 

    // Camps fetch karo
    const assignedCamps = await Camp.find({ 
      volunteers: { $regex: new RegExp(`^${escapedName}$`, "i") } 
    }).select('_id');

    // Agar koi camp assign nahi hai
    if (!assignedCamps || assignedCamps.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      }); 
    }

    const campIds = assignedCamps.map(camp => camp._id);

    // Patients fetch karo
    const patients = await Patient.find({ campId: { $in: campIds } })
      .populate("campId", "name location")
      .select("+reportPdfUrl")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${patients.length} patients for ${employeeName}`);

    // 🔥 Response mein count add kiya
    res.status(200).json({
      success: true,
      count: patients.length,
      message: `Patients fetched successfully for ${employeeName}`,
      data: patients
    });

  } catch (err) {
    console.log("❌ GET ASSIGNED PATIENTS ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch assigned patients",
      error: err.message 
    });
  }
});
/* -----------------------------------------------------
  2️⃣ GET SINGLE PATIENT (✅ FIXED: Added reportPdfUrl)
------------------------------------------------------ */
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("campId", "name location address date time status")
      .select("+reportPdfUrl");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
  3️⃣ CREATE PATIENT
------------------------------------------------------ */
router.post("/", async (req, res) => {
  try {
    const {
      salutation,
      name,
      age,
      gender,
      contact,
      address,
      campId,
      campName
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Patient name is required" });
    }
    if (!age) {
      return res.status(400).json({ error: "Age is required" });
    }
    if (!contact) {
      return res.status(400).json({ error: "Contact number is required" });
    }
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    let finalCampId = campId;

    if (!finalCampId) {
      if (!campName) {
        return res.status(400).json({ error: "campId or campName is required" });
      }

      const camp = await Camp.findOne({ name: campName });
      if (!camp) {
        return res.status(404).json({ error: "Camp not found" });
      }

      finalCampId = camp._id;
    }

    const vitals = {};
    if (req.body.weight && req.body.height) {
      const bmi = calculateBMI(req.body.weight, req.body.height);
      vitals.weight = parseFloat(req.body.weight);
      vitals.height = parseFloat(req.body.height);
      vitals.bmi = parseFloat(bmi);
      vitals.bmiCategory = getBMICategory(bmi);
    }

    if (req.body.bpSystolic || req.body.bpSys) {
      vitals.bpSys = parseFloat(req.body.bpSystolic || req.body.bpSys);
    }
    if (req.body.bpDiastolic || req.body.bpDia) {
      vitals.bpDia = parseFloat(req.body.bpDiastolic || req.body.bpDia);
    }

    if (req.body.sugar || req.body.rbs) {
      vitals.sugar = parseFloat(req.body.sugar || req.body.rbs);
      vitals.sugarType = req.body.sugarType || (req.body.rbs ? "Random" : "Fasting");
    }

    if (Object.keys(vitals).length > 0) {
      vitals.updatedAt = new Date();
    }

    const patient = await Patient.create({
      salutation: salutation || "",
      name,
      age,
      gender,
      contact,
      address,
      campId: finalCampId,
      tests: [],
      vitals: vitals,
      reportPdfUrl: null
    });

    res.status(201).json(patient);

  } catch (err) {
    console.error("CREATE PATIENT ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

/* -----------------------------------------------------
  4️⃣ UPDATE PATIENT
------------------------------------------------------ */
router.put("/:id", async (req, res) => {
  try {
    const {
      salutation,
      name,
      age,
      gender,
      contact,
      address,
      campId
    } = req.body;

    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (salutation !== undefined) patient.salutation = salutation;
    if (name) patient.name = name;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (address) patient.address = address;
    if (campId) patient.campId = campId;

    await patient.save();

    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient
    });
  } catch (err) {
    console.error("UPDATE PATIENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// /* -----------------------------------------------------
//   5️⃣ ADD TEST
// ------------------------------------------------------ */
// router.post("/:id/tests", async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ error: "Patient not found" });
//     }

//     const {
//       type,
//       value,
//       value2,
//       sugarType,
//       unit,
//       doctorVerification,
//       eyeVisionLeft,
//       eyeVisionRight,
//       eyePressureLeft,
//       eyePressureRight,
//       eyeColorVision,
//       eyeCataract,
//       eyeGlaucoma,
//       hemoglobin,
//       whiteBloodCells,
//       platelets,
//       cholesterol,
//       triglycerides,
//       hba1c,
//       bmi
//     } = req.body;

//     if (!type || value === undefined) {
//       return res.status(400).json({ error: "Invalid test data" });
//     }

//     const newTest = {
//       type,
//       value: parseFloat(value),
//       date: new Date(),
//       doctorVerification: doctorVerification || { status: "pending" }
//     };

//     if (value2 !== undefined && value2 !== null && value2 !== "") {
//       newTest.value2 = parseFloat(value2);
//     }
//     if (sugarType) newTest.sugarType = sugarType;
//     if (unit) newTest.unit = unit;

//     // Set fallback units based on type if not provided
//     if (!newTest.unit) {
//       if (type === "bp") newTest.unit = "mmHg";
//       if (type === "weight") newTest.unit = "kg";
//       if (type === "height") newTest.unit = "cm";
//       if (type === "sugar") newTest.unit = "mg/dL";
//       if (type === "temperature") newTest.unit = "°F";
//       if (type === "heart_rate") newTest.unit = "bpm";
//       if (type === "oxygen") newTest.unit = "%";
//       if (type === "eye_exam") newTest.unit = "exam";
//       if (type === "blood_test") newTest.unit = "panel";
//       if (type === "full_body_checkup") newTest.unit = "checkup";
//       if (type === "general_checkup") newTest.unit = "checkup";
//     }

//     if (type === "bp" && !newTest.value2) {
//       return res.status(400).json({ error: "Diastolic value required" });
//     }

//     // Copy custom fields if provided
//     if (eyeVisionLeft !== undefined && eyeVisionLeft !== null && eyeVisionLeft !== "") newTest.eyeVisionLeft = parseFloat(eyeVisionLeft);
//     if (eyeVisionRight !== undefined && eyeVisionRight !== null && eyeVisionRight !== "") newTest.eyeVisionRight = parseFloat(eyeVisionRight);
//     if (eyePressureLeft !== undefined && eyePressureLeft !== null && eyePressureLeft !== "") newTest.eyePressureLeft = parseFloat(eyePressureLeft);
//     if (eyePressureRight !== undefined && eyePressureRight !== null && eyePressureRight !== "") newTest.eyePressureRight = parseFloat(eyePressureRight);
//     if (eyeColorVision) newTest.eyeColorVision = eyeColorVision;
//     if (eyeCataract) newTest.eyeCataract = eyeCataract;
//     if (eyeGlaucoma) newTest.eyeGlaucoma = eyeGlaucoma;

//     if (hemoglobin !== undefined && hemoglobin !== null && hemoglobin !== "") newTest.hemoglobin = parseFloat(hemoglobin);
//     if (whiteBloodCells !== undefined && whiteBloodCells !== null && whiteBloodCells !== "") newTest.whiteBloodCells = parseFloat(whiteBloodCells);
//     if (platelets !== undefined && platelets !== null && platelets !== "") newTest.platelets = parseFloat(platelets);
//     if (cholesterol !== undefined && cholesterol !== null && cholesterol !== "") newTest.cholesterol = parseFloat(cholesterol);
//     if (triglycerides !== undefined && triglycerides !== null && triglycerides !== "") newTest.triglycerides = parseFloat(triglycerides);
//     if (hba1c !== undefined && hba1c !== null && hba1c !== "") newTest.hba1c = parseFloat(hba1c);
//     if (bmi !== undefined && bmi !== null && bmi !== "") newTest.bmi = parseFloat(bmi);

//     patient.tests.push(newTest);

//     /* ---------- UPDATE VITALS ---------- */
//     if (!patient.vitals) patient.vitals = {};

//     if (type === "weight") patient.vitals.weight = newTest.value;
//     if (type === "height") patient.vitals.height = newTest.value;

//     if (type === "sugar") {
//       patient.vitals.sugar = newTest.value;
//       patient.vitals.sugarType = newTest.sugarType || sugarType || "Random";
//     }

//     if (type === "bp") {
//       console.log(`Storing BP: Sys ${newTest.value}, Dia ${newTest.value2}`);
//       patient.vitals.bpSys = newTest.value;
//       patient.vitals.bpDia = newTest.value2;
//     }

//     /* ---------- AUTO BMI ---------- */
//     const { weight, height } = patient.vitals;
//     if (weight && height) {
//       const bmiVal = calculateBMI(weight, height);
//       patient.vitals.bmi = parseFloat(bmiVal);
//       patient.vitals.bmiCategory = getBMICategory(bmiVal);
//     }

//     patient.vitals.updatedAt = new Date();

//     await patient.save();

//     res.json({
//       success: true,
//       message: "Test added successfully",
//       vitals: patient.vitals
//     });

//   } catch (err) {
//     console.error("❌ ADD TEST ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });



router.post("/:id/tests", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 🔥 NAYA LOGIC: Agar frontend "vitals" object bhej raha hai (Ek hi baar mein sab)
    if (req.body.vitals) {
      const v = req.body.vitals;
      if (!patient.vitals) patient.vitals = {};
      const currentDate = new Date();

      // 1. Weight
      if (v.weight) {
        patient.vitals.weight = parseFloat(v.weight);
        patient.tests.push({ type: "weight", value: parseFloat(v.weight), date: currentDate, unit: "kg" });
      }

      // 2. Height
      if (v.height) {
        patient.vitals.height = parseFloat(v.height);
        patient.tests.push({ type: "height", value: parseFloat(v.height), date: currentDate, unit: "cm" });
      }

      // 3. Sugar
      if (v.sugar) {
        patient.vitals.sugar = parseFloat(v.sugar);
        patient.vitals.sugarType = v.sugarType || "Random";
        patient.tests.push({ type: "sugar", value: parseFloat(v.sugar), sugarType: v.sugarType || "Random", date: currentDate, unit: "mg/dL" });
      }

      // 4. BP
      if (v.systolic && v.diastolic) {
        patient.vitals.bpSys = parseFloat(v.systolic);
        patient.vitals.bpDia = parseFloat(v.diastolic);
        patient.tests.push({ type: "bp", value: parseFloat(v.systolic), value2: parseFloat(v.diastolic), date: currentDate, unit: "mmHg" });
      }

      // 5. Auto BMI
      if (patient.vitals.weight && patient.vitals.height) {
        const hM = patient.vitals.height / 100;
        const bmiVal = patient.vitals.weight / (hM * hM);
        patient.vitals.bmi = parseFloat(bmiVal.toFixed(1));
        patient.vitals.bmiCategory = getBMICategory(bmiVal);
      }

      patient.vitals.updatedAt = currentDate;
      await patient.save();

      return res.json({
        success: true,
        message: "Vitals updated successfully in one go",
        vitals: patient.vitals
      });
    }

    // ==========================================
    // PURANA LOGIC (Single Test) - Waise hi rahega
    // ==========================================
    const { type, value, value2, sugarType, unit, doctorVerification } = req.body;

    if (!type || value === undefined) {
      return res.status(400).json({ error: "Invalid test data" });
    }

    const newTest = {
      type,
      value: parseFloat(value),
      date: new Date(),
      doctorVerification: doctorVerification || { status: "pending" }
    };

    if (value2 !== undefined && value2 !== null && value2 !== "") newTest.value2 = parseFloat(value2);
    if (sugarType) newTest.sugarType = sugarType;
    if (unit) newTest.unit = unit;

    if (!newTest.unit) {
      if (type === "bp") newTest.unit = "mmHg";
      if (type === "weight") newTest.unit = "kg";
      if (type === "height") newTest.unit = "cm";
      if (type === "sugar") newTest.unit = "mg/dL";
    }

    if (type === "bp" && !newTest.value2) {
      return res.status(400).json({ error: "Diastolic value required" });
    }

    patient.tests.push(newTest);

    if (!patient.vitals) patient.vitals = {};
    if (type === "weight") patient.vitals.weight = newTest.value;
    if (type === "height") patient.vitals.height = newTest.value;
    if (type === "sugar") {
      patient.vitals.sugar = newTest.value;
      patient.vitals.sugarType = newTest.sugarType || sugarType || "Random";
    }
    if (type === "bp") {
      patient.vitals.bpSys = newTest.value;
      patient.vitals.bpDia = newTest.value2;
    }

    if (patient.vitals.weight && patient.vitals.height) {
      const hM = patient.vitals.height / 100;
      const bmiVal = patient.vitals.weight / (hM * hM);
      patient.vitals.bmi = parseFloat(bmiVal.toFixed(1));
      patient.vitals.bmiCategory = getBMICategory(bmiVal);
    }

    patient.vitals.updatedAt = new Date();
    await patient.save();

    res.json({
      success: true,
      message: "Test added successfully",
      vitals: patient.vitals
    });

  } catch (err) {
    console.error("❌ ADD TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



/* -----------------------------------------------------
  UPDATE PATIENT TEST
------------------------------------------------------ */
router.put("/:id/updatetests", async (req, res) => {
  try {
    const { testId, type, value, value2, sugarType, unit, doctorVerification } = req.body;

    console.log("========== UPDATE PATIENT TEST ==========");
    console.log("Patient ID:", req.params.id);
    console.log("Test ID:", testId);
    console.log("Request Body:", req.body);

    if (!testId) {
      return res.status(400).json({ error: "Test ID is required" });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const test = patient.tests.id(testId);

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    if (type !== undefined) test.type = type;
    if (value !== undefined) test.value = parseFloat(value);
    if (value2 !== undefined) {
      test.value2 = value2 === "" || value2 === null ? undefined : parseFloat(value2);
    }
    if (sugarType !== undefined) test.sugarType = sugarType;
    if (unit !== undefined) test.unit = unit;
    if (doctorVerification !== undefined) {
      test.doctorVerification = doctorVerification;
    }

    test.date = new Date();

    // Default unit
    if (!test.unit) {
      if (test.type === "bp") test.unit = "mmHg";
      if (test.type === "weight") test.unit = "kg";
      if (test.type === "height") test.unit = "cm";
      if (test.type === "sugar") test.unit = "mg/dL";
    }

    // BP validation
    if (test.type === "bp" && (test.value2 === undefined || test.value2 === null)) {
      return res.status(400).json({ error: "Diastolic value required" });
    }

    // Update patient vitals
    if (!patient.vitals) patient.vitals = {};

    if (test.type === "weight") {
      patient.vitals.weight = test.value;
    }

    if (test.type === "height") {
      patient.vitals.height = test.value;
    }

    if (test.type === "sugar") {
      patient.vitals.sugar = test.value;
      patient.vitals.sugarType = test.sugarType || "Random";
    }

    if (test.type === "bp") {
      patient.vitals.bpSys = test.value;
      patient.vitals.bpDia = test.value2;
    }

    // Recalculate BMI
    if (patient.vitals.weight && patient.vitals.height) {
      const hM = patient.vitals.height / 100;
      const bmiVal = patient.vitals.weight / (hM * hM);

      patient.vitals.bmi = parseFloat(bmiVal.toFixed(1));
      patient.vitals.bmiCategory = getBMICategory(bmiVal);
    }

    patient.vitals.updatedAt = new Date();

    await patient.save();

    console.log("Updated Test:", test);
    console.log("Updated Vitals:", patient.vitals);

    return res.json({
      success: true,
      message: "Test updated successfully",
      data: test,
      vitals: patient.vitals
    });

  } catch (err) {
    console.error("❌ UPDATE PATIENT TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
  6️⃣ GET ALL TESTS OF PATIENT
------------------------------------------------------ */
router.get("/:id/tests", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient.tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
  7️⃣ DELETE PATIENT
------------------------------------------------------ */
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------------------
  8️⃣ VERIFY TEST (DOCTOR)
------------------------------------------------------ */
router.patch("/:id/tests/:testId/verify", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const test = patient.tests.id(req.params.testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    test.doctorVerification = {
      status: "approved",
      approvedBy: req.body?.doctor || "Doctor",
      approvedAt: new Date()
    };

    await patient.save();
    res.json({ message: "Test verified successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




export default router;