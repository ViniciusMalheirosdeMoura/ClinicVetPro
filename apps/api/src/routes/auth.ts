import { Router } from "express";
import { registerOwnerController, loginController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register-owner", registerOwnerController);
authRouter.post("/login", loginController);
