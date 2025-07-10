import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subject } from "../models/subject.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const createSubject = asyncHandler(async (req, res) => {
    try {
       const { subName, code, teacher, semester } = req.body;
       if (!subName || !code || !teacher || !semester) {
           throw new ApiError(400, "All fields are required");
       }
       const existingSubject = await Subject.findOne({subName, code });
       return res
       .status(200)
       .json(new ApiResponse(200, "Subject created successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }

})    

export const allSubjects = asyncHandler(async (req, res) => {
        try {
            const subjects = await Subject.find();
            if (subjects.length === 0) {
                return res.status(404).json(new ApiResponse("No subjects found", []));
            }
            res.status(200).json(new ApiResponse("Subjects fetched successfully", subjects));
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    });
    
export const updateSubject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { subName, code, teacher, semester } = req.body;
        const subject = await Subject.findById(id);
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
        // only allow updating name, code
        subject.subName = subName || subject.subName;
        subject.code = code || subject.code;

        const updatedSubject = await subject.save();
        res.status(200).json(new ApiResponse("Subject updated successfully", updatedSubject));
    } catch (error) {
        
    }
})

export const deleteSubject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
        await subject.deleteOne();
        res.status(200).json(new ApiResponse("Subject deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
})

module.exports = {
    createSubject,
    allSubjects,
    updateSubject,
    deleteSubject
};