import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import { createTutorController, listTutorsController } from "../controllers/tutors.controller.js";

export const tutorsRouter = Router();

tutorsRouter.get("/", requireAuth, authorize(["OWNER", "ADMIN", "DOCTOR", "RECEPTION"]), listTutorsController);
tutorsRouter.post("/", requireAuth, authorize(["OWNER", "ADMIN"]), createTutorController);
