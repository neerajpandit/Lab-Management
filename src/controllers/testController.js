import pool from '../config/db.js';
import{ asyncHandler} from '../middlewares/asyncHandler.js';    

export const addTest = asyncHandler(async (req, res) => {
    const { lab_id, name, category, price, description,sample_type, unit, min_range, max_range, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO Tests (lab_id, name, category, price, description,sample_type, unit, min_range, max_range, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *`,
            [lab_id, name, category, price, description,sample_type, unit, min_range, max_range, status || 'active']
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});