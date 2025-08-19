import { Request, Response } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export const uploadVideo = [
  upload.single("video"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file was uploaded." });
      }
      res.status(200).json({
        message: "Video uploaded successfully.",
        videoId: req.file.filename,
      });
    } catch (error) {
      console.error("Failed to upload video:", error);
      res.status(500).json({ error: "An error occurred during file upload." });
    }
  },
];