
import { asyncHandler } from '../middleware/async.js';
import { addDoctorService, getDoctorService, updateDoctorService } from '../models/doctorModel.js';

export const addDoctor = asyncHandler(async (req, res) => {
    const { lab_id, full_Name, email, phone, specialization, experience   } = req.body;
    if (!lab_id || full_Name || !email || !phone || !specialization || !experience) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const doctor = await addDoctorService(lab_id, full_Name, email, phone, specialization, experience);
    if (!doctor) {
        return res.status(400).json({ success: false, error: 'Doctor not added' });
    }
    res.status(201).json({ success: true, doctor });


});

export const getAllDoctor= asyncHandler(async (req, res) => {
    const { lab_id } = req.params;
    if (!lab_id) {
        return res.status(400).json({ success: false, error: 'Please provide lab_id' });
    }
    const doctors = await getDoctorService(lab_id);
    if (!doctors) {
        return res.status(400).json({ success: false, error: 'No doctors found' });
    }
    res.status(200).json({ success: true, doctors });
});

export const updateDoctor = asyncHandler(async (req, res) => {
    const { lab_id, full_Name, email, phone, specialization, experience } = req.body;
    if (!lab_id || full_Name || !email || !phone || !specialization || !experience) {
        return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const doctor = await updateDoctorService(lab_id, full_Name, email, phone, specialization, experience);
    if (!doctor) {
        return res.status(400).json({ success: false, error: 'Doctor not added' });
    }
    res.status(201).json({ success: true, doctor });
});

export const deleteDoctor = asyncHandler(async (req, res) => {
    const { lab_id,doctor_id } = req.params;
    if (!lab_id || !doctor_id) {
        return res.status(400).json({ success: false, error: 'Please provide lab_id' });
    }
    const doctor = await deleteDoctorService(lab_id,doctor_id);
    if (!doctor) {
        return res.status(400).json({ success: false, error: 'Doctor not deleted' });
    }
    res.status(200).json({ success: true, doctor });
});