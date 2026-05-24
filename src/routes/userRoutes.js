import express from "express";
import {getProfile} from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.patch("/update-profile", protect, () => {});
router.delete("/delete-account", protect, () => {});

export default router;
