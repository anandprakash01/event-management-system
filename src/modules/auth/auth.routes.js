import express from "express";
import {loginUser, logoutUser, registerUser} from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", () => {});

export default router;
