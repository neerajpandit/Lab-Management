import { asyncHandler } from "../middlewares/asyncHandler.js";
import pool from "../config/db.js";

// 📌 Add a new patient with tests
export const addPatientWithTest = asyncHandler(async (req, res, next) => {
    
    try {
        const assigned_by = req.userId;
        if (!assigned_by) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
        const {
            lab_id, first_name, last_name, email, phone, age, date_of_birth, gender, address,
            doctor_id, report_mode, blood_group,  test_status, test_date, sample_type,
            collection_type, remarks, test_ids
        } = req.body;

        if (!lab_id || !first_name || !age || !gender || !address || !test_ids?.length) {
            return res.status(400).json({ message: "Missing required fields or no tests assigned." });
        }

        // 🔍 Fetch Test Details from `Tests` Table
        const testQuery = `
            SELECT id AS test_id, name AS test_name, category, price, unit, min_range, max_range 
            FROM Tests 
            WHERE id = ANY($1) AND lab_id = $2;
        `;
        const { rows: testDetails } = await pool.query(testQuery, [test_ids, lab_id]);

        if (!testDetails.length) {
            return res.status(404).json({ message: "No valid tests found for given test IDs." });
        }

        // 🛠 Prepare JSONB Data for `test_results`
        const testResults = testDetails.map(test => ({
            test_id: test.test_id,
            test_name: test.test_name,
            category: test.category,
            price: test.price,
            unit: test.unit,
            min_range: test.min_range,
            max_range: test.max_range,
            result_value: null,
            result_status: "pending",
            remarks: ""
        }));

        const insertQuery = `
            INSERT INTO PatientWithTest (
                lab_id, first_name, last_name, email, phone, age, date_of_birth, gender, address, 
                doctor_id, report_mode, blood_group, assigned_by, test_status, test_results, 
                test_date, sample_type, collection_type, remarks
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15::JSONB, 
                $16, $17, $18, $19
            ) 
            RETURNING *;
        `;

        const { rows } = await pool.query(insertQuery, [
            lab_id, first_name, last_name, email, phone, age, date_of_birth, gender, address,
            doctor_id, report_mode, blood_group, assigned_by, test_status, JSON.stringify(testResults),
            test_date, sample_type, collection_type, remarks
        ]);

        return res.status(201).json({ message: "Patient added successfully!", data: rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Update test results

export const updateTestResults = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params; // Patient ID
        const { test_results } = req.body; // New test result values

        if (!test_results || !Array.isArray(test_results)) {
            return res.status(400).json({ message: "Invalid test results format." });
        }

        const updateQuery1 = `
            UPDATE PatientWithTest
            SET test_results = (
                SELECT jsonb_agg(
                    CASE 
                        WHEN test->>'test_id' IN (SELECT jsonb_array_elements_text($1::JSONB)->>'test_id') THEN 
                            jsonb_set(test, '{result_value}', to_jsonb(
                                (SELECT jsonb_array_elements($1::JSONB) 
                                WHERE jsonb_array_elements($1::JSONB)->>'test_id' = test->>'test_id')::JSONB->>'result_value'
                            )::JSONB, true)
                        ELSE 
                            test 
                    END
                ) 
                FROM jsonb_array_elements(test_results) AS test
            ),
            test_status = 'completed',
            updatedAt = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;
        const updateQuery = `
            UPDATE PatientWithTest
            SET 
                test_results = $1::JSONB,
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;

        const { rows } = await pool.query(updateQuery, [
            JSON.stringify(test_results),
            id
        ]);

        if (!rows.length) {
            return res.status(404).json({ message: "Patient test results not found." });
        }

        return res.status(200).json({ message: "Test results updated successfully!", data: rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Get patient details with tests
export const getPatient = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        const selectQuery = `
            SELECT p.*, l.name AS lab_name, d.full_name AS doctor_name
            FROM PatientWithTest p
            LEFT JOIN Labs l ON p.lab_id = l.id
            LEFT JOIN Doctors d ON p.doctor_id = d.id
            WHERE p.id = $1;
        `;

        const { rows } = await pool.query(selectQuery, [id]);

        if (!rows.length) {
            return res.status(404).json({ message: "Patient not found." });
        }

        return res.status(200).json({ message: "Patient details fetched!", data: rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




















export const createResult = asyncHandler(async (req, res, next) => {
    try {
        const { patient_id, lab_id, assigned_by, test_ids } = req.body; // test_ids should be an array

        if (!patient_id || !lab_id || !assigned_by || !test_ids.length) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // 🔍 Fetch Test Details from `Tests` Table
        const testQuery = `
            SELECT id AS test_id, name AS test_name, category, price, unit, min_range, max_range 
            FROM Tests 
            WHERE id = ANY($1) AND lab_id = $2
        `;
        const { rows: testDetails } = await pool.query(testQuery, [test_ids, lab_id]);

        if (!testDetails.length) {
            return res.status(404).json({ message: "No valid tests found for given test IDs." });
        }

        // 🛠 Prepare JSONB Data for `test_results`
        const testResults = testDetails.map(test => ({
            test_id: test.test_id,
            test_name: test.test_name,
            category: test.category,
            price: test.price,
            unit: test.unit,
            min_range: test.min_range,
            max_range: test.max_range,
            result_value: null, // 🚀 Will be updated later
            result_status: "pending",
            remarks: ""
        }));

        // 🔄 Insert into `TestsResult`
        const insertQuery = `
            INSERT INTO TestsResult (patient_id, lab_id, assigned_by, test_results, test_status)
            VALUES ($1, $2, $3, $4::JSONB, 'pending')
            RETURNING *;
        `;
        const { rows: insertedRows } = await pool.query(insertQuery, [
            patient_id,
            lab_id,
            assigned_by,
            JSON.stringify(testResults)
        ]);

        return res.status(201).json({ message: "Test assigned successfully!", data: insertedRows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// {
//     "patient_id": 1,
//     "lab_id": 2,
//     "assigned_by": 3,
//     "test_ids": [1, 2, 3]
// }



export const updateResult = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { test_results } = req.body; // Expected to be an updated JSON array

        if (!test_results || !Array.isArray(test_results)) {
            return res.status(400).json({ message: "Invalid test results format." });
        }

        // 🔄 Update query
        const updateQuery = `
            UPDATE TestsResult
            SET test_results = $1::JSONB, test_status = 'completed', updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `;

        const { rows } = await pool.query(updateQuery, [JSON.stringify(test_results), id]);

        if (!rows.length) {
            return res.status(404).json({ message: "Test result not found." });
        }

        return res.status(200).json({ message: "Test results updated successfully!", data: rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});