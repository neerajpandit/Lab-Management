import pool from "../config/db";


export const addDepartmentService = async(lab_id, department_name,code,sort_order,status)=>{
    try{
        const result = await pool.query(
            "INSERT INTO departments (lab_id, department_name, code, sort_order, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [lab_id, department_name,code,sort_order,status]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in addDepartmentService:", error.message);
        throw new Error("Database Error while creating department");
    }
}

export const getDepartmentService = async(lab_id)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM departments WHERE lab_id = $1",
            [lab_id]
        );
        return result.rows;
    }catch(error){
        console.error("Error in getDepartmentService:", error.message);
        throw new Error("Database Error while fetching departments");
    }
}

export const updateDepartmentService = async(lab_id, department_name,code,sort_order,status)=>{
    try{
        const result = await pool.query(
            "UPDATE departments SET department_name = $2, code = $3, sort_order = $4, status = $5 WHERE lab_id = $1 RETURNING *",
            [lab_id, department_name,code,sort_order,status]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in updateDepartmentService:", error.message);
        throw new Error("Database Error while updating department");
    }
}

export const getDepartmentByIdService = async(id)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM departments WHERE department_id = $1",
            [id]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error in getDepartmentByIdService:", error.message);
        throw new Error("Database Error while fetching department");
    }
}