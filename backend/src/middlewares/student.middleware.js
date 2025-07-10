import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const student = await Student.findById(decodedToken?.id).select("-password -refreshToken");

        if(!student){
            throw new ApiError(401, "unauthorized request");
        }

        req.student = student;
        next();
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid acess token");
    }
})