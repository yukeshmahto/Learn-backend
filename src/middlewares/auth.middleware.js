import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";  
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
   try{
    const token = req.cookies.accessToken || req.headers("Authorization")?.replace("Bearer ", "")

   if (!token) {
      return res.status(401).json({success: false, message: "Unauthorized Request"})
   }

   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded?._id).select("-password -refreshToken")

  if (!user) {
    throw new ApiError(404, "Invalid access token");
  }

    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
    }
   
});

