import express from "express";

import {protect, restrictTo} from "../../middleware/auth.middleware.js";
import {validateRequest} from "../../middleware/validate.middleware.js";
import {sanitizeEmptyStrings} from "../../middleware/sanitize.middleware.js";

import {
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
} from "./event.validation.js";

import {
  getAllEvents,
  createEvent,
  getEventById,
  getMyTickets,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from "./event.controller.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/my-tickets", protect, getMyTickets);
router.get("/:id", getEventById);

router.use(protect);

router.post(
  "/",
  // restrictTo("admin"),
  // sanitizeEmptyStrings,
  validateRequest(createEventSchema),
  createEvent,
);

router.patch("/:id", validateRequest(updateEventSchema), updateEvent);

router.delete("/:id", validateRequest(deleteEventSchema), deleteEvent);

router.post("/:id/register", registerForEvent);

// router.post("/:id/rsvp", rsvpForEvent);
// RSVP is an abbreviation for the French phrase "Répondez s'il vous plaît", which translates to "Please respond".
// In the software and event world, it simply means "Booking a spot" or "Registering to attend."

// Express reads routes from top to bottom. If you put /my-tickets below /:id, Express will see the incoming request and think: 'my-tickets' must be an Event ID!" It will try to look up an event with the ID "my-tickets", fail, and throw a CastError.

export default router;
