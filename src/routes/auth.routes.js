import {Router} from "express";

const router = Router();

import {registerUser,login, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword, getCurrentUser, resendEmailVerification} from "../controllers/auth.controllers.js";
// router.route("/register").post(registerUser); 



import { resetForgotPasswordValidator, userChangeCurrentPasswordValidator, userForgetPasswordValidator, userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
//unsecured routes
router.route("/register").post(userRegisterValidator(), validateRequest, registerUser); 
router.route("/login").post(userLoginValidator(),validateRequest,login);


router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgetPasswordValidator(),validateRequest, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post|(resetForgotPasswordValidator(),validateRequest, resetForgotPassword);







// secured routes
router.route("/logout").post(verifyJwt,logoutUser);
router.route("/current-user").get(verifyJwt,getCurrentUser);
router.route("/change-password").post(verifyJwt,userChangeCurrentPasswordValidator(),validateRequest,changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJwt,resendEmailVerification);




export default router;