import {Router} from "express";

const router = Router();

import {registerUser,login} from "../controllers/auth.controllers.js";
// router.route("/register").post(registerUser); 



import { userLoginValidator, userRegisterValiator } from "../validators/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
router.route("/register").post(userRegisterValiator(), validateRequest, registerUser); 
router.route("/login").post(userLoginValidator(),validateRequest,login);



export default router;