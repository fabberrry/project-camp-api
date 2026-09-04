import {Router} from "express";

const router = Router();

import {registerUser} from "../controllers/auth.controllers.js";
// router.route("/register").post(registerUser); 



import { userRegisterValiator } from "../validators/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
router.route("/register").post(userRegisterValiator(), validateRequest, registerUser);



export default router;