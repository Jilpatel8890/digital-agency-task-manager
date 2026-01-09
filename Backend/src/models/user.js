import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      unique: true,
      sparse: true, // important for invited users
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    name: String,
    image: String,

    role: {
      type: String,
      enum: ["manager", "content writer", "graphic designer", "social media manager"],
      default: null,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
