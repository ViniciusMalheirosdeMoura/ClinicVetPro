import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import {
  listMembersController,
  removeMemberController,
  updateMemberRoleController,
} from "../controllers/members.controller.js";

export const membersRouter = Router();

membersRouter.get("/", requireAuth, authorize(["OWNER", "ADMIN"]), listMembersController);

membersRouter.patch("/:id/role", requireAuth, authorize(["OWNER"]), updateMemberRoleController);

membersRouter.delete("/:id", requireAuth, authorize(["OWNER"]), removeMemberController);
