import {Event} from "./event.model.js";
import {Attendee} from "./attendee.model.js";

import {asyncHandler} from "../../utils/asyncHandler.js";
import {AppError} from "../../utils/AppError.js";

const allowedCategory = [
  "Concert",
  "Standup Comedy",
  "Meetup",
  "Party",
  "Conference",
  "Webinar",
  "Workshop",
  "Other",
];

const allowedTypes = ["VIP", "Standard"];

const createEvent = asyncHandler(async (req, res) => {
  // const {title, description, date, location, category, capacity} = req.body;

  // if (!title || !description || !date || !location || !capacity) {
  //   throw new AppError(
  //     400,
  //     "All field required, An event should have: Title, Description, Data, Location and Capacity.",
  //   );
  // }

  // if ((category || category === "") && !allowedCategory.includes(category)) {
  //   throw new AppError(400, `Category can only be one of these: ${allowedCategory}`);
  // }

  // const eventData = {
  //   title,
  //   description,
  //   date,
  //   location,
  //   category,
  //   capacity,
  //   organizer: organizerId,
  // };

  const newEvent = await Event.create({
    ...req.body,
    organizer: req.user._id,
  });

  await newEvent.populate("organizer", "name");

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: {
      event: newEvent,
    },
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  const updateData = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(404, "Event not found!");
  }

  // SECURITY CHECK: Is the person making the request the actual organizer?
  if (event.organizer.toString() !== userId.toString()) {
    throw new AppError(403, "You are not authorize to update this event");
  }
  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  await updatedEvent.populate("organizer", "name");

  res.status(200).json({
    success: true,
    message: `Event [${updateEvent.title}] updated`,
    data: {
      event: updatedEvent,
    },
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const eventId = req.params.id;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  if (event.organizer.toString() !== userId.toString()) {
    throw new AppError(403, "You are not authorize to delete this event");
  }

  await Attendee.deleteMany({event: eventId});
  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event and all the associated tickets have been deleted",
    data: null,
  });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).populate("organizer", "name");

  res.status(200).json({
    success: true,
    message: "All event fetched successfully",
    data: {
      events,
    },
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError(404, "Event not found");
  }
  res.status(200).json({
    success: true,
    message: `${event.title} is fetched successfully`,
    data: {
      event,
    },
  });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const {id: eventId} = req.params;
  const userId = req.user._id;

  const {ticketType} = req.body;

  if (ticketType && !allowedTypes.includes(ticketType)) {
    throw new Error(400, "Ticket type can be only Standard or VIP");
  }

  const alreadyRegistered = await Attendee.exists({
    user: userId,
  });
  if (alreadyRegistered) {
    throw new AppError(400, "You are already registered to this event");
  }

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      $expr: {$lt: ["$attendeesCount", "$capacity"]},
    },
    {
      $inc: {attendeesCount: 1},
    },
    {
      // new:true// deprecated
      returnDocument: "after",
      sanitizeFilter: false,
    },
  );
  // use $inc directly in the database to prevent Race Conditions.

  // There are two possible scenarios why it returned null:
  // Scenario A (404 Error): The user passed a fake or deleted eventId. The first rule failed.
  // Scenario B (400 Error): The event is real, but attendeesCount is 100 and capacity is 100. The second rule failed.

  if (!event) {
    const eventExists = await Event.exists({_id: eventId});
    if (!eventExists) {
      throw new AppError(404, "Event not found!");
    }
    throw new AppError(400, "Sorry! this event is completely sold out");
  }

  // BAD: If 5 users hit this line at the exact same millisecond when capacity is 99/100, all 5 will see that the event is NOT sold out.
  // if (event.attendeesCount >= event.capacity) {
  //   throw new AppError(400, "Sorry, this event is completely sold out!");
  // }

  // await Event.findByIdAndUpdate(eventId, {$inc: {attendeesCount: 1}});

  const ticket = await Attendee.create({
    event: eventId,
    user: userId,
    ticketType,
  });

  await ticket.populate([
    {path: "user", select: "name email"},
    {path: "event", select: "title data location"},
  ]);

  res.status(201).json({
    success: true,
    message: `Registered for the event: ${event.title}`,
    data: {
      ticket,
    },
  });
});

const getMyTickets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tickets = await Attendee.find({user: userId})
    .populate({
      path: "event",
      select: "title date location status category capacity attendeesCount",
    })
    .sort("-createdAt"); // tickets bought most recently show up first

  res.status(200).json({
    success: true,
    message: "All ticket fetched",
    results: tickets.length,
    data: tickets,
  });
});

export {
  registerForEvent,
  getAllEvents,
  createEvent,
  getEventById,
  getMyTickets,
  updateEvent,
  deleteEvent,
};
