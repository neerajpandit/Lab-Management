import { asyncHandler } from "../middlewares/asyncHandler";
import { addDepartmentService, getDepartmentByIdService, getDepartmentService, updateDepartmentService } from "../models/departmentModel";


export const addDepartment = asyncHandler(async (req, res) => {  
    const { lab_id, department_name,code,sort_order,status } = req.body;
    if (!lab_id || !department_name || !code || !sort_order || !status) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }
    const department = await addDepartmentService(lab_id, department_name,code,sort_order,status);
    if (!department) {
        return res.status(400).json({ success: false, error: 'Department not added' });
    }
    res.status(201).json({ success: true, department });
});

export const getAllDepartment = asyncHandler(async (req, res) => {
    const { lab_id } = req.params;
    if (!lab_id) {
        return res.status(400).json({ success: false, error: 'Please provide lab_id' });
    }
    const departments = await getDepartmentService(lab_id);
    if (!departments) {
        return res.status(400).json({ success: false, error: 'No departments found' });
    }
    res.status(200).json({ success: true, departments });
});

export const updateDepartment = asyncHandler(async (req, res) => {
    const { lab_id, department_name,code,sort_order,status } = req.body;
    if (!lab_id || !department_name || !code || !sort_order || !status) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }
    const department = await updateDepartmentService(lab_id, department_name,code,sort_order,status);
    if (!department) {
        return res.status(400).json({ success: false, error: 'Department not updated' });
    }
    res.status(201).json({ success: true, department });
});

export const getDepartmentById = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, error: 'Please provide department id' });
    }
    const department = await getDepartmentByIdService(id);
    if (!department) {
        return res.status(400).json({ success: false, error: 'Department not found' });
    }
    res.status(200).json({ success: true, department });
});