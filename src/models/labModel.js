import pool from "../config/db.js";


export const createLabService = async (owner_id, name, contact_email, contact_phone, address, city,state,country,pincode) => {
  try {
    const result = await pool.query(
      "INSERT INTO labs (owner_id, name, contact_email, contact_phone, address, city,state,country,pincode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [owner_id, name, contact_email, contact_phone, address, city,state,country,pincode]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in createLabService:", error.message);
    throw new Error("Database Error while creating lab");
  }
}

export const getLabService = async (lab_id, owner_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM labs WHERE  id = $1 AND owner_id= $2 AND is_deleted = false",
      [lab_id,owner_id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error("Error in getLabService:", error.message);
    throw new Error("Database Error while fetching lab");
  }
};

export const getAllLabsService = async (owner_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM labs WHERE owner_id = $1 AND is_deleted = false",
      [owner_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAllLabsService:", error.message);
    throw new Error("Database Error while fetching labs");
  }
};

export const updateLabService = async (
    lab_id, 
    owner_id, 
    name, 
    logo_url, 
    contact_email, 
    contact_phone, 
    address, 
    city, 
    state, 
    country, 
    pincode, 
    latitude, 
    longitude, 
    website_url, 
    description, 
    status, 
    is_deleted
  ) => {
    try {
      const result = await pool.query(
        `UPDATE labs 
         SET 
           name = COALESCE($1, name), 
           logo_url = COALESCE($2, logo_url), 
           contact_email = COALESCE($3, contact_email), 
           contact_phone = COALESCE($4, contact_phone), 
           address = COALESCE($5, address), 
           city = COALESCE($6, city), 
           state = COALESCE($7, state), 
           country = COALESCE($8, country), 
           pincode = COALESCE($9, pincode), 
           latitude = COALESCE($10, latitude), 
           longitude = COALESCE($11, longitude), 
           website_url = COALESCE($12, website_url), 
           description = COALESCE($13, description), 
           status = COALESCE($14, status), 
           is_deleted = COALESCE($15, is_deleted),
           updatedAt = CURRENT_TIMESTAMP
         WHERE id = $16 AND owner_id = $17 AND is_deleted = false 
         RETURNING *`,
        [
          name, logo_url, contact_email, contact_phone, address, city, 
          state, country, pincode, latitude, longitude, website_url, 
          description, status, is_deleted, lab_id, owner_id
        ]
      );
  
      return result.rows[0];
    } catch (error) {
      console.error("Error in updateLabService:", error.message);
      throw new Error("Database Error while updating lab");
    }
  };
  