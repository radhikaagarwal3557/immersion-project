import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Access token missing");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      throw new ApiError(401, "Unauthorized - Admin not found");
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new ApiError(401, error.message || "Unauthorized"));
  }
};
