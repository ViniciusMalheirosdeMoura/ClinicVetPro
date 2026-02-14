import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import { createPetController, listPetsController } from "../controllers/pets.controller.js";

export const petsRouter = Router();

petsRouter.get("/", requireAuth, authorize(["OWNER", "ADMIN", "DOCTOR", "RECEPTION"]), listPetsController);

petsRouter.post(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN", "RECEPTION"]),
  createPetController
);
