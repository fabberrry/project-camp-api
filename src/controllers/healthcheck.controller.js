import { ApiResponse } from "../utils/api-response.js";

/*
const healthCheck = (req, res,next) => {
    try {
        res.status(200).json(new ApiResponse(200, "Server is healthy"));
    } catch (err) {
        next(err);
    }
};
*/

import { asyncHandler } from "../utils/asyncHandler.js";
const healthCheck = asyncHandler( async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Server is healthy"));
});
export { healthCheck };
