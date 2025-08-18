import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

export const createCourse = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description: description || null,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Failed to create course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the course." });
  }
};

export const createModule = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description, videoUrl } = req.body;

  if (!title || !videoUrl || !courseId) {
    return res
      .status(400)
      .json({ error: "Title, videoUrl, and courseId are required." });
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const newModule = await prisma.module.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        course: {
          connect: { id: courseId },
        },
      },
    });

    res.status(201).json(newModule);
  } catch (error) {
    console.error("Failed to create module:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the module." });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description } = req.body;
  if ((!title && !description) || !courseId) {
    return res
      .status(400)
      .json({ error: "Please provide a title or description to update." });
  }

  try {
    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Course not found." });
    }
    console.error("Failed to update course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the course." });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const { title, description, videoUrl } = req.body;

  if (!title && !description && !videoUrl) {
    return res.status(400).json({ error: "Please provide data to update." });
  }

  try {
    const updatedModule = await prisma.module.update({
      where: {
        id: moduleId,
      },
      data: {
        title,
        description,
        videoUrl,
      },
    });

    res.status(200).json(updatedModule);
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Module not found." });
    }
    console.error("Failed to update module:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the module." });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  try {
    await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Module not found." });
    }
    console.error("Failed to delete module:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the module." });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
      return res.status(404).json({ error: "Course not found." });
    }
    console.error("Failed to delete course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the course." });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Failed to get courses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching courses." });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Failed to get course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the course." });
  }
};
