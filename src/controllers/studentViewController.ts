import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const getMyCourses = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.id;

  try {
    const studentWithCourses = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        enrolledCourses: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!studentWithCourses) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json(studentWithCourses.enrolledCourses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching your courses." });
  }
};

export const getMyCourseById = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.id;
  const { courseId } = req.params;

  try {
    const enrollment = await prisma.course.findFirst({
      where: {
        id: courseId,
        enrolledStudents: {
          some: {
            id: studentId,
          },
        },
      },
      include: {
        modules: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not enrolled in this course." });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the course." });
  }
};
