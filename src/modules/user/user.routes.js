import express from "express";

import {protect} from "../../middleware/auth.middleware.js";
import {getMe, getUserById} from "./user.controller.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/:id", protect, getUserById);
router.delete("/:id", () => {}); // admin only

export default router;
