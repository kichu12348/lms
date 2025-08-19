import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import fs from "fs";

interface VideoOptions {
    filePath: string;
    title: string;
    description: string;
}

export async function uploadVideoToYouTube(auth: OAuth2Client, options: VideoOptions): Promise<string> {
    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
            snippet: {
                title: options.title,
                description: options.description,
                tags: ["lms", "education", "video"],
                categoryId: "27", // Category "27" is for Education
            },
            status: {
                privacyStatus: "unlisted",
            },
        },
        media: {
            body: fs.createReadStream(options.filePath),
        },
    });

    const videoId = response.data.id;
    if (!videoId) {
        throw new Error("YouTube upload failed: No video ID was returned.");
    }

    return videoId;
}