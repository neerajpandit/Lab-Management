import pool from "../config/db";

export const addMachineService = async(lab_id, machine_name, machine_code, status)=>{
    try{
        const result = await pool.query(
            "INSERT INTO machines (lab_id, machine_name, machine_code, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [lab_id, machine_name, machine_code, status]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in addMachineService:", error.message);
        throw new Error("Database Error while creating machine");
    }
}

export const getMachineService = async(lab_id)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM machines WHERE lab_id = $1",
            [lab_id]
        );
        return result.rows;
    }catch(error){
        console.error("Error in getMachineService:", error.message);
        throw new Error("Database Error while fetching machines");
    }
}

export const updateMachineService = async(lab_id,id, machine_name, machine_code, status)=>{
    try{
        const result = await pool.query(
            "UPDATE machines SET machine_name = $2, machine_code = $3, status = $4 WHERE lab_id = $1 AND id = $5 RETURNING *",
            [lab_id, machine_name, machine_code, status,id]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in updateMachineService:", error.message);
        throw new Error("Database Error while updating machine");
    }
}

export const getMachineByIdService = async(id,lab_id)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM machines WHERE id = $1 AND lab_id = $2",
            [id,lab_id]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in getMachineByIdService:", error.message);
        throw new Error("Database Error while fetching machine");
    }
}