import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createStudent = async (req: Request, res: Response) => {
  const { email, password, courseIds } = req.body;
  if (!email || !password || !Array.isArray(courseIds)) {
    return res.status(400).json({
      error: "Email, password, and an array of courseIds are required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT",
        enrolledCourses: {
          connect: courseIds.map((id: string) => ({ id })),
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        enrolledCourses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2002") {
      return res
        .status(409)
        .json({ error: "A user with this email already exists." });
    }
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res
        .status(400)
        .json({ error: "One or more course IDs are invalid." });
    }
    console.error("Failed to create student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the student." });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { courseIds } = req.body;

  if (!Array.isArray(courseIds)) {
    return res
      .status(400)
      .json({ error: "An array of courseIds is required." });
  }

  try {
    const updatedStudent = await prisma.user.update({
      where: {
        id: studentId,
        role: "STUDENT",
      },
      data: {
        enrolledCourses: {
          set: courseIds.map((id: string) => ({ id })),
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        enrolledCourses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res
        .status(404)
        .json({ error: "Student or a specified course not found." });
    }
    console.error("Failed to update student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the student." });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id: studentId,
        role: "STUDENT",
      },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Student not found." });
    }
    console.error("Failed to delete student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the student." });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(students);
  } catch (error) {
    console.error("Failed to get students:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching students." });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        enrolledCourses: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Failed to get student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the student." });
  }
};
