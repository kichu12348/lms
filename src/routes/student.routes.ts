import { Router } from "express";
import {
  getMyCourses,
  getMyCourseById,
} from "../controllers/studentViewController";
import { getSignedVideoStreamUrl } from "../controllers/getSignedUrlController";

const router = Router();

router.get("/courses", getMyCourses);
router.get("/courses/:courseId", getMyCourseById);
router.get("/modules/:moduleId/view", getSignedVideoStreamUrl);

export default router;
