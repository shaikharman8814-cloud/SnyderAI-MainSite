import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized");
  } catch (err) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", err);
  }
} else {
  console.warn("FIREBASE_SERVICE_ACCOUNT not set. Standard reset emails will be used as fallback.");
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Professional Password Reset
  app.post("/api/auth/reset-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!resend || !admin.apps.length) {
      console.error("Resend or Firebase Admin not configured");
      return res.status(500).json({
        error: "Server email infrastructure not configured. Please add RESEND_API_KEY and FIREBASE_SERVICE_ACCOUNT."
      });
    }

    try {
      // 1. Generate the reset link via Firebase Admin
      const link = await admin.auth().generatePasswordResetLink(email);

      // 2. Send the professional HTML email via Resend
      const { data, error } = await resend.emails.send({
        from: "SnyderAI Security <security@snyderai.com>",
        to: [email],
        subject: "Reset your SnyderAI password",
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 48px 32px; color: #111827; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 24px;">
            <div style="margin-bottom: 40px;">
              <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #000;">Snyder<span style="font-style: italic;">AI</span></span>
            </div>
            
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 20px; letter-spacing: -0.025em;">Reset your password</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
              We received a request to reset your password for your SnyderAI account. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="margin-bottom: 40px;">
              <a href="${link}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.2s;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; margin-bottom: 32px;">
              For security, this link will expire in 1 hour.
            </p>
            
            <div style="border-top: 1px solid #f3f4f6; padding-top: 32px; margin-top: 32px;">
              <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin: 0;">
                Aetheris Intelligence Layer
              </p>
              <p style="font-size: 12px; color: #d1d5db; margin-top: 8px;">
                Empowering the future of agentic AI.
              </p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {

    const { name, email, type, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!resend) {
      console.error("RESEND_API_KEY is not configured");
      return res.status(500).json({
        error: "Email service not configured. Please add RESEND_API_KEY to environment variables."
      });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "SnyderAI Contact <onboarding@resend.dev>",
        to: ["snyderaidevelopers@gmail.com"],
        subject: `New ${type} Inquiry from ${name}`,
        replyTo: email,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type:</strong> ${type}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">This email was sent from the SnyderAI Contact Portal.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
