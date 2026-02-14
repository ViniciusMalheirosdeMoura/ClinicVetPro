import { Router } from "express";
import {
  registerOwnerController,
  loginController,
  selectClinicController,
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register-owner", registerOwnerController);
authRouter.post("/login", loginController);
authRouter.post("/select-clinic", selectClinicController);
