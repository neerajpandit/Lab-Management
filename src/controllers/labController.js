import { ApiError } from "../middlewares/ApiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { createLabService, getAllLabsService, getLabService, updateLabService } from "../models/labModel.js";


export const createLab = asyncHandler(async (req, res, next) => {
    const owner_id = req.userId;
    // console.log(owner_id);
    
    try {
        const { name, contact_email, contact_phone, address, city,state,country,pincode} = req.body;
        if (!name || !contact_email || !contact_phone || !address || !city || !state || !country || !pincode) {
            throw new ApiError(400, "All fields are required");
        }
        const lab = await createLabService(owner_id, name, contact_email, contact_phone, address, city,state,country,pincode);
        handleResponse(res, 201, "Lab created successfully", lab);
    } catch (err) {
        next(err);
    }
});

export const getLabById = asyncHandler(async (req, res, next) => {
    const lab_id = req.params.id;
    const owner_id = req.userId;
    console.log(lab_id);
    
    const lab = await getLabService(lab_id, owner_id);
    if (!lab) {
        throw new ApiError(404, "Lab not found");
    }
    handleResponse(res, 200, "Lab found", lab);
});

export const getAllLabsByOwnerId = asyncHandler(async (req, res, next) => {
    const owner_id = req.userId;
    const labs = await getAllLabsService(owner_id);
    handleResponse(res, 200, "Labs found", labs);
});

export const updateLab = asyncHandler(async (req, res, next) => {
    const lab_id = req.params.id;
    const owner_id = req.userId;
    
    const {
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
    } = req.body;

    // Check for required fields
    if (!name || !contact_email || !contact_phone || !address || !city || !state || !country || !pincode) {
        throw new ApiError(400, "Name, contact email, phone, address, city, state, country, and pincode are required");
    }

    const updatedLab = await updateLabService(
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
    );

    handleResponse(res, 200, "Lab updated successfully", updatedLab);
});
