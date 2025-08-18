import express from "express";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";
import { protectAdmin, protectStudent } from "./middleware/authMiddleware";

const app = express();

app.use(express.json());

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
