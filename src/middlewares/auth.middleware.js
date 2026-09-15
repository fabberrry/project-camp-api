import { projectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const tokenAT =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!tokenAT) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(tokenAT, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if (!user) {
      throw new ApiError(401, "Invalid AccessToken");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid AccessToken");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectid } = req.params;
    if (!projectid) {
      throw new ApiError(404, "Id not found");
    }

    const projectMbrDoc = await projectMember.findOne({
      project: new mongoose.Types.ObjectId(projectid),
      user: new mongoose.Types.ObjectId(req.user._id),
    });
    if (!projectMbrDoc) {
      throw new ApiError(404, "not found");
    }

    const givenRole = projectMbrDoc?.role;
    req.user.role = givenRole;
    if (!roles.includes(givenRole)) {
      throw ApiError(404, "You dont have permission to perform this action");
    }
    next();
  });
};
