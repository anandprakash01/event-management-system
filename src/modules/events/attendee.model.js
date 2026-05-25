import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["Registered", "Waitlisted", "Cancelled"],
      default: "Registered",
    },
    ticketType: {
      type: String,
      enum: ["Standard", "VIP"],
      default: "Standard",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent a user from registering for the exact same event twice!
attendeeSchema.index({event: 1, user: 1}, {unique: true});

const Attendee = mongoose.model("Attendee", attendeeSchema);

export default Attendee;
