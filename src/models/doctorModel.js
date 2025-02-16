import pool from "../config/db";

export const addDoctorService = async(lab_id, full_Name, email,phone, specialization, experience)=>{
    try{
        const result = await pool.query(
            "INSERT INTO doctors (lab_id, full_name, email, phone, specialization, experience) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [lab_id, full_Name, email, phone, specialization, experience]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in addDoctorService:", error.message);
        throw new Error("Database Error while creating doctor");
    }
}

export const getDoctorService = async(lab_id)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM doctors WHERE lab_id = $1",
            [lab_id]
        );
        return result.rows;
    }catch(error){
        console.error("Error in getDoctorService:", error.message);
        throw new Error("Database Error while fetching doctors");
    }
}

export const updateDoctorService = async(lab_id, full_Name, email,phone, specialization, experience)=>{
    try{
        const result = await pool.query(
            "UPDATE doctors SET full_name = $2, email = $3, phone = $4, specialization = $5, experience = $6 WHERE lab_id = $1 RETURNING *",
            [lab_id, full_Name, email, phone, specialization, experience]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in updateDoctorService:", error.message);
        throw new Error("Database Error while updating doctor");
    }
}

export const deleteDoctorService = async(lab_id,doctor_id)=>{
    try{
        const result = await pool.query(
            "UPDATE doctors SET is_deleted = $3 WHERE lab_id = $1 AND doctor_id = $2 RETURNING *",
            [lab_id, doctor_id, true]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in deleteDoctorService:", error.message);
        throw new Error("Database Error while deleting doctor");
    }
};