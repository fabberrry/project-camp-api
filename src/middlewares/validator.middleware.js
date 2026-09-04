import { validationResult } from "express-validator";
// utils
import { ApiError } from "../utils/api-error.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  return next(new ApiError(422, "Validation failed", extractedErrors));
};
