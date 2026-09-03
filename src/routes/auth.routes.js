import {Router} from "express";

const router = Router();

import {registerUser} from "../controllers/auth.controllers.js";
router.route("/register").post(registerUser);

export default router;