import { Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import { getAuthenticatedClient } from "../lib/youtubeAuth";
import { uploadVideoToYouTube } from "../lib/youtubeUploader";

const upload = multer({ dest: "uploads/" });

export const uploadVideo = [
  upload.single("video"),

  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No video file was uploaded." });
    }
    const title = `${Date.now()}-${req.file.originalname}-${Math.random().toString(36).substring(2, 15)}`;
    const description = req.body.description || "";

    try {
      const authClient = await getAuthenticatedClient();
      const videoId = await uploadVideoToYouTube(authClient, {
        filePath: req.file.path,
        title: title,
        description: description || "",
      });

      res.status(200).json({
        message: "Video uploaded successfully to YouTube.",
        videoId: videoId,
      });
    } catch (error) {
      console.error("Failed to upload video to YouTube:", error);
      res
        .status(500)
        .json({ error: "An error occurred during the YouTube upload." });
    } finally {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Failed to delete temporary file:", unlinkError);
      }
    }
  },
];
