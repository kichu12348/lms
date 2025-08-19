import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";
import { protectAdmin, protectStudent } from "./middleware/authMiddleware";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_, res) => {
  res.json({
    message: "working",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", protectAdmin, adminRoutes);
app.use("/api/v1/student", protectStudent, studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
