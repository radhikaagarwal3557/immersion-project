import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const admin= await Admin.findById(decodedToken?.id).select("-password -refreshToken");

        if(!admin){
            throw new ApiError(401, "unauthorized request");
        }

        req.admin = admin;
        next();
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid acess token");
    }
})