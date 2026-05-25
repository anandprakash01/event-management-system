import {z} from "zod";

const createEventValidator = z.object({
  body: z.object({
    title: z
      .string({require_error: "Title is required"})
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100),

    description: z
      .string({require_error: "Description is required"})
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(1000),

    // date: z.coerce.date().min(new Date(), "Event date cannot be in the past"),

    // when you define a schema in a file (like event.validation.js), JavaScript reads and evaluates that file exactly once, the moment you turn the server on.

    // That means new Date() fires when the server boots up, and it is permanently frozen in memory.
    // If you start your server on Monday, and keep it running until Friday, the .min() check will still be using Monday's date! A user on Thursday could create an event for Tuesday, and Zod would let it pass because Tuesday is greater than Monday!

    date: z.coerce
      .date()
      .refine(val => val > new Date(), {message: "Event cannot be in past"}),

    location: z.string().min(3, "Location must be at least 3 characters"),

    category: z
      .enum([
        "Concert",
        "Standup Comedy",
        "Meetup",
        "Party",
        "Conference",
        "Webinar",
        "Workshop",
        "Other",
      ])
      .default("Other"),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(2, "Capacity must be at least 2 characters")
      .max(100000, "Capacity exceeds system limits"),

    status: z.enum(["Draft", "Published", "Cancelled", "Completed"]).optional(),
  }),
});

const updateEventValidator = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(1000)
      .optional(),

    date: z.coerce
      .date()
      .refine(val => val > new Date(), {message: "Event cannot be in past"})
      .optional(),

    location: z.string().min(3, "Location must be at least 3 characters").optional(),

    category: z
      .enum([
        "Concert",
        "Standup Comedy",
        "Meetup",
        "Party",
        "Conference",
        "Webinar",
        "Workshop",
        "Other",
      ])
      .default("Other"),

    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .min(2, "Capacity must be at least 2 characters")
      .max(100000, "Capacity exceeds system limits")
      .optional(),

    status: z.enum(["Draft", "Published", "Cancelled", "Completed"]).optional(),
  }),
});
const deleteEventValidator = z.object({});

export {createEventValidator, updateEventValidator, deleteEventValidator};
