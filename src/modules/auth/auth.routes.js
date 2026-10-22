import express from "express";

import {protect} from "../../middleware/auth.middleware.js";
import {validateRequest} from "../../middleware/validate.middleware.js";
import {registerUserSchema, loginUserSchema} from "./auth.validation.js";
import {registerUser, loginUser, logoutUser} from "./auth.controller.js";

const router = express.Router();

router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", () => {});

export default router;
