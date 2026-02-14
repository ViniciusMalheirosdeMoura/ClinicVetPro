import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./db/prisma.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middlewares/requireAuth.js";
import { tutorsRouter } from "./routes/tutors.js";
import { petsRouter } from "./routes/pets.js";
import { appointmentsRouter } from "./routes/appointments.js";
import { invitesRouter } from "./routes/invites.js";
import { membersRouter } from "./routes/members.js";




const app = express();
app.get("/clinics", async (_req, res) => {
  const clinics = await prisma.clinic.findMany({ orderBy: { createdAt: "desc" } });
  res.json(clinics);
});

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/tutors", tutorsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/pets", petsRouter);
app.use("/invites", invitesRouter);
app.use("/members", membersRouter);


app.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, name: "ClinicVetPro API" });
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`[api] running on http://localhost:${port}`);
});
