import { Router } from "express";
import {
  createCourse,
  createModule,
  updateCourse,
  updateModule,
  deleteModule,
  deleteCourse,
  getAllCourses,
  getCourseById,
} from "../controllers/courseController";
import {
  createStudent,
  deleteStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
} from "../controllers/studentController";

const router = Router();

// Course Management
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseById);
router.post("/courses", createCourse);
router.put("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);

// Module Management
router.post("/courses/:courseId/modules", createModule);
router.put("/modules/:moduleId", updateModule);
router.delete("/modules/:moduleId", deleteModule);

// Student Management
router.get("/students", getAllStudents);
router.get("/students/:studentId", getStudentById);
router.post("/students", createStudent);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);

export default router;
