import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

export const trackVisitor = async (req, res, next) => {
    try {
        // Check for 'visitor_id' in cookies
        let visitorId = req.cookies.visitor_id;

        if (!visitorId) {
            // Generate a new unique visitor ID
            visitorId = uuidv4();

            // Save visitor_id in the database
            await pool.query(
                'INSERT INTO UniqueVisitors (visitor_id) VALUES ($1)',
                [visitorId]
            );

            // Set the visitor_id as a cookie in the browser
            res.cookie('visitor_id', visitorId, {
                httpOnly: true, // Secure from client-side JS
                maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
            });
        }

        next(); // Continue to the next middleware or route
    } catch (error) {
        console.error('Error tracking visitor:', error);
        res.status(500).send('An error occurred while tracking visitors.');
    }
};
