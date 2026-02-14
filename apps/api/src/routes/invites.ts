import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import {
  acceptInviteController,
  createInviteController,
  listInvitesController,
  revokeInviteController,
  validateInviteController,
} from "../controllers/invites.controller.js";

export const invitesRouter = Router();

// público
invitesRouter.get("/:token", validateInviteController);
invitesRouter.post("/accept", acceptInviteController);

// privado
invitesRouter.get("/", requireAuth, authorize(["OWNER", "ADMIN"]), listInvitesController);
invitesRouter.post("/", requireAuth, authorize(["OWNER", "ADMIN"]), createInviteController);
invitesRouter.post("/:id/revoke", requireAuth, authorize(["OWNER", "ADMIN"]), revokeInviteController);
