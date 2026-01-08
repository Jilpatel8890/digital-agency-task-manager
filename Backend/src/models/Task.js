import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      enum: ["Instagram", "Facebook", "LinkedIn", "Website"],
      required: true,
    },

    task_type: {
      type: String,
      enum: ["Post", "Reel", "Blog"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    due_date: {
      type: Date,
      required: true,
    },

    post_link: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
