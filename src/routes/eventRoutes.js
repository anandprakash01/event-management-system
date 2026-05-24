import express from "express";

import {protect, restrictTo} from "../middlewares/authMiddleware.js";
import {validate} from "../middlewares/validate.js";
import {cleanEmptyStrings} from "../middlewares/cleanEmptyStrings.js";
import {
  createEventValidator,
  deleteEventValidator,
  updateEventValidator,
} from "../validations/eventValidations.js";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  updateEvent,
  getMyTickets,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/my-tickets", protect, getMyTickets);

router.post(
  "/create",
  protect,
  restrictTo("admin"),
  cleanEmptyStrings,
  validate(createEventValidator),
  createEvent,
);

router.get("/:id", getEventById);

router.use(protect); // Applies the JWT check to all routes below this line

router.patch("/:id", validate(updateEventValidator), updateEvent);

router.delete("/:id", validate(deleteEventValidator), deleteEvent);

router.post("/:id/register", cleanEmptyStrings, registerForEvent);

// router.post("/:id/rsvp", rsvpForEvent);
// RSVP is an abbreviation for the French phrase "Répondez s'il vous plaît", which translates to "Please respond".
// In the software and event world, it simply means "Booking a spot" or "Registering to attend."

// Express reads routes from top to bottom. If you put /my-tickets below /:id, Express will see the incoming request and think: 'my-tickets' must be an Event ID!" It will try to look up an event with the ID "my-tickets", fail, and throw a CastError.

export default router;
