import { Router } from "express";
import {
  getMyCourses,
  getMyCourseById,
} from "../controllers/studentViewController";

const router = Router();

router.get("/courses", getMyCourses);
router.get("/courses/:courseId", getMyCourseById);

export default router;
