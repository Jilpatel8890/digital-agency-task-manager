import Task from "../models/Task.js";
import Client from "../models/client.js";
import User from "../models/user.js";

/**
 * CREATE TASK (Manager only)
 */
export const createTask = async (req, res) => {
  try {
    const {
      taskname,
      client_id,
      assigned_to,
      platform,
      task_type,
      due_date,
      status,
      post_link,
      notes,
    } = req.body;

    if (!taskname || !client_id || !assigned_to || !platform || !task_type || !due_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate client
    const client = await Client.findOne({
      _id: client_id,
      isActive: true,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found or inactive" });
    }

    // Validate assigned user
    const user = await User.findOne({
      _id: assigned_to,
      approved: true,
      isActive: true,
      role: { $in: ["content writer", "graphic designer", "social media manager"] },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or inactive team member" });
    }

    const task = await Task.create({
      taskname,
      client_id,
      assigned_to,
      platform,
      task_type,
      due_date,
      status,
      post_link,
      notes,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * GET TASKS
 * Admin → all
 * Team → assigned only
 */
export const getAllTasks = async (req, res) => {
  try {
    const filter =
      ["content writer", "graphic designer", "social media manager"].includes(req.user.role)
        ? { assigned_to: req.user._id }
        : {};

    const tasks = await Task.find(filter)
      .populate("client_id", "name industry")
      .populate("assigned_to", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("FETCH TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/**
 * UPDATE TASK (Admin only)
 */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

/**
 * DELETE TASK (Admin only)
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
