import mongoose from "mongoose";
import {maxLength, minLength} from "zod";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    // "date": "2026-06-15T18:30:00.000Z" Notice the Z at the end? That means UTC Time. Always store dates in UTC in your database. Let the frontend worry about converting it to the user's local timezone (like IST).
    date: {
      type: Date,
      required: [true, "Event date and time are required"],
      validate: {
        validator: value => value > Date.now(),
        message: "Event date can not be in past",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Concert",
        "Standup Comedy",
        "Meetup",
        "Party",
        "Conference",
        "Webinar",
        "Workshop",
        "Other",
      ],
      default: "Other",
    },
    // The user who created the event
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // How many people can attend?
    capacity: {
      type: Number,
      required: [true, "Please specify the maximum capacity"],
      min: [2, "Capacity must be at least 2"],
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Cancelled", "Completed"],
      default: "Published",
    },
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

eventSchema.virtual("remainingTickets").get(function () {
  return this.capacity - this.attendeesCount;
});

// Indexing for faster search queries later on
eventSchema.index({title: "text", description: "text"});
eventSchema.index({date: 1});

const Event = mongoose.model("Event", eventSchema);

export {Event};
