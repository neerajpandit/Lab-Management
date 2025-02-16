import { getMachineByIdService } from "../models/machineModel";

export const addMachine = asyncHandler(async (req, res) => {
    const { lab_id, machine_name, machine_code, status } = req.body;
    if (!lab_id || !machine_name || !machine_code || !status) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }
    const machine = await addMachineService(lab_id, machine_name, machine_code, status);
    if (!machine) {
        return res.status(400).json({ success: false, error: 'Machine not added' });
    }
    res.status(201).json({ success: true, machine });
});

export const getAllMachine = asyncHandler(async (req, res) => {
    const { lab_id } = req.params;
    if (!lab_id) {
        return res.status(400).json({ success: false, error: 'Please provide lab_id' });
    }
    const machines = await getMachineService(lab_id);
    if (!machines) {
        return res.status(400).json({ success: false, error: 'No machines found' });
    }
    res.status(200).json({ success: true, machines });
});

export const updateMachine = asyncHandler(async (req, res) => {
    const { lab_id,id, machine_name, machine_code, status } = req.body;
    if (!lab_id || !id || !machine_name || !machine_code || !status) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }
    const machine = await updateMachineService(lab_id,id, machine_name, machine_code, status);
    if (!machine) {
        return res.status(400).json({ success: false, error: 'Machine not updated' });
    }
    res.status(201).json({ success: true, machine });
});

export const getMachineById = asyncHandler(async (req, res) => {
    const { lab_id,id } = req.params;
    if (!id || !lab_id) {
        return res.status(400).json({ success: false, error: 'Please provide machine id' });
    }
    const machine = await getMachineByIdService(id ,lab_id);
    if (!machine) {
        return res.status(400).json({ success: false, error: 'Machine not found' });
    }
    res.status(200).json({ success: true, machine });
});