import {z} from "zod";
import mongoose from "mongoose";

const requiredMsg = fieldName => ({
  error: iss => (!iss.input ? `${fieldName} is required` : `Invalid ${fieldName} format`),
});

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

const createEventSchema = z.object({
  body: z.object({
    title: z
      // .string({required_error: "Title is required"}) // deprecated in Zod V4
      .string({error: iss => (!iss.input ? "Name is required" : "Invalid input")})
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title cannot have more than 100 character"),

    description: z
      .string(requiredMsg("Description"))
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(1000, "Description cannot have more than 100 character"),

    date: z.coerce
      .date()
      .refine(val => val > new Date(), {message: "Event cannot be in past"}),

    location: z.string().min(3, "Location must be at least 3 characters"),

    category: z.enum(allowedCategory).default("Other"),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(2, "Capacity must be at least 2 people")
      .max(100000, "Capacity exceeds system limits"),

    status: z.enum(["Draft", "Published", "Cancelled", "Completed"]).optional(),
  }),
});

const updateEventSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title cannot have more than 100 character")
      .optional(),

    description: z
      .string()
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(1000, "Description cannot have more than 100 character")
      .optional(),

    date: z.coerce
      .date()
      .refine(val => val > new Date(), {message: "Event cannot be in past"})
      .optional(),

    location: z.string().min(3, "Location must be at least 3 characters").optional(),

    category: z.enum(allowedCategory).optional(),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(2, "Capacity must be at least 2 people")
      .max(100000, "Capacity exceeds system limits")
      .optional(),

    status: z.enum(["Draft", "Published", "Cancelled", "Completed"]).optional(),
  }),
});

const deleteEventSchema = z.object({
  params: z.object({
    id: z
      .string({error: iss => (!iss.input ? "ID is required!" : "Invalid Id format")})
      .length(24, "Invalid Event ID format")
      .refine(val => mongoose.isValidObjectId(val), {
        message: "Invalid Event ID format",
      }),
  }),
});

export {createEventSchema, updateEventSchema, deleteEventSchema};
