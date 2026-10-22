import {z} from "zod";

const requiredMsg = fieldName => ({
  error: iss => (!iss.input ? `${fieldName} is required` : `Invalid ${fieldName} format`),
});

const registerUserSchema = z.object({
  body: z.object({
    name: z
      // .string({required_error: "Title is required"}) // deprecated in Zod V4
      .string({error: iss => (!iss.input ? "Name is required" : "Invalid input")})
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot have more than 50 character"),

    email: z
      .string(requiredMsg("Email"))
      .trim()
      .toLowerCase()
      .max(100, "Email cannot exceed 100 characters")
      .pipe(z.email("Please provide a valid email address")),

    password: z
      .string(requiredMsg("Password"))
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long"), // Prevents ReDoS attacks (sending massive passwords to crash your hashing algorithm)

    role: z.enum(["user", "admin", "architect"]).default("user"),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string(requiredMsg("Email"))
      .trim()
      .toLowerCase()
      .max(100, "Email cannot exceed 100 characters")
      .pipe(z.email("Please provide a valid email address")),

    password: z
      .string(requiredMsg("Password"))
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long"),
  }),
});

export {registerUserSchema, loginUserSchema};
