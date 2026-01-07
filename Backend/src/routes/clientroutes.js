import express from "express";
import  clerkAuth  from "../middleware/clerkAuth.js";
import { loadUser } from "../middleware/loaduser.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientcontroller.js";

const router = express.Router();

/**
 * Create client (Admin / Manager)
 */
router.post(
  "/",
  clerkAuth,
  loadUser,
  requireRole(["admin", "manager"]),
  createClient
);

router.get("/", clerkAuth, loadUser, getAllClients);

router.get("/:id", clerkAuth, loadUser, getClientById);

router.put(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["admin", "manager"]),
  updateClient
);

router.delete(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["admin", "manager"]),
  deleteClient
);

export default router;
