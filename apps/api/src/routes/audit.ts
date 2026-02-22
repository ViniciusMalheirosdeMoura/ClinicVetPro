import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { listAuditController } from "../controllers/audit.controller.js";

const auditRouter = Router();

auditRouter.get("/", requireAuth, listAuditController);

export default auditRouter;
