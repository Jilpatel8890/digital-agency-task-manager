import express from "express";
import clerkAuth from "../middleware/clerkAuth.js";
import { loadUser } from "../middleware/loaduser.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskcontroller.js";

const router = express.Router();

router.post(
  "/",
  clerkAuth,
  loadUser,
  requireRole(["manager"]),
  createTask
);

router.get("/", clerkAuth, loadUser, getAllTasks);

router.put(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["manager"]),
  updateTask
);

router.delete(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["manager"]),
  deleteTask
);

export default router;
