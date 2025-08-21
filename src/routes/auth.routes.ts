// src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import { login } from "../controllers/authController";
import { getAuthUrl, saveToken } from "../lib/youtubeAuth";

const router = Router();

let hasAuth = false;

router.post("/login", login);

router.get("/google", async (req: Request, res: Response) => {
    if (hasAuth) {
        return res.status(400).json({ error: "No" });
    }
    try {
        const url = await getAuthUrl();
        res.redirect(url);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate auth URL." });
    }
});

router.get("/google/callback", async (req: Request, res: Response) => {
    if (hasAuth) {
        return res.status(400).json({ error: "No" });
    }
    const { code } = req.query;
    if (typeof code !== 'string') {
        return res.status(400).send("Invalid authorization code.");
    }
    try {
        await saveToken(code);
        res.send("Authentication successful! You can close this tab.");
        hasAuth = true; // prevent re-authentication
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save authentication token." });
    }
});

export default router;