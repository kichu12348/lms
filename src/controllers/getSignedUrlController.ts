import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const getSignedVideoStreamUrl = async (
  req: AuthRequest,
  res: Response
) => {
  const studentId = req.user!.id;
  const { moduleId } = req.params;

  try {
    const myModule = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });

    if (!myModule) {
      return res.status(404).json({ error: "Module not found." });
    }

    const enrollment = await prisma.user.findFirst({
      where: {
        id: studentId,
        enrolledCourses: { some: { id: myModule.courseId } },
      },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course." });
    }

    const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID!;
    const privateKey = process.env.CLOUDFLARE_STREAM_PRIVATE_KEY!;

    const payload = {
      sub: myModule.videoId,
      kid: keyId,
      exp: Math.floor(Date.now() / 1000) + 3600,
      accessRules: [
        { type: "ip.src", ip: [req.ip], action: "allow" },
        { type: "any", action: "block" },
      ],
    };

    const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

    const signedUrl = `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${myModule.videoId}/iframe?token=${token}`;

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    res
      .status(500)
      .json({ error: "An error occurred while preparing the video." });
  }
};
