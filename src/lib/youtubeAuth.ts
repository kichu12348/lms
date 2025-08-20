import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import fs from "fs/promises";
import path from "path";

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const CLIENT_SECRET_PATH = path.join(process.cwd(), "client_secret.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

let oauth2Client: OAuth2Client | null = null;

async function getOauthClient(): Promise<OAuth2Client> {
    if (oauth2Client) return oauth2Client;

    const secrets = process.env.CLIENT_SECRET || "";
    const credentials = JSON.parse(secrets);
    const { client_secret, client_id, redirect_uris } = credentials.web;

    const client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = await fs.readFile(TOKEN_PATH, "utf-8");
        client.setCredentials(JSON.parse(token));
    } catch (err) {
    }
    
    oauth2Client = client;
    return oauth2Client;
}

export async function getAuthUrl(): Promise<string> {
    const client = await getOauthClient();
    return client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
}

export async function saveToken(code: string): Promise<void> {
    const client = await getOauthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log("Token stored to", TOKEN_PATH);
}

export async function getAuthenticatedClient(): Promise<OAuth2Client> {
    const client = await getOauthClient();
    if (!client.credentials || !client.credentials.access_token) {
        throw new Error("User not authenticated. Please visit the auth URL first.");
    }
    return client;
}