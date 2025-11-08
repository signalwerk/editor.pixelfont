import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const ENABLE_CLEANUP = process.env.ENABLE_CLEANUP === "true";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || join(__dirname, "data", "fonts.db");

// Ensure data directory exists
const dataDir = dirname(DB_PATH);
mkdirSync(dataDir, { recursive: true });

// Initialize SQLite database
const db = new Database(DB_PATH);

// Create fonts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS fonts (
    userId TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    lastUpdate INTEGER NOT NULL,
    fontData TEXT NOT NULL
  )
`);

// Create index for faster queries
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_lastUpdate ON fonts(lastUpdate)
`);

console.log(`Database initialized at: ${DB_PATH}`);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Receive font data from clients
app.post("/api/fonts", (req, res) => {
  try {
    const fontData = req.body;

    if (!fontData.userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const lastUpdate = Date.now();

    // Store or update font data (keyed by userId, not author)
    const stmt = db.prepare(`
      INSERT INTO fonts (userId, author, lastUpdate, fontData)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(userId) DO UPDATE SET
        author = excluded.author,
        lastUpdate = excluded.lastUpdate,
        fontData = excluded.fontData
    `);

    stmt.run(
      fontData.userId,
      fontData.author || "Unknown",
      lastUpdate,
      JSON.stringify(fontData),
    );

    console.log(
      `Received font data from: ${fontData.author} (${fontData.userId})`,
    );

    res.json({
      success: true,
      message: "Font data received",
      userId: fontData.userId,
      author: fontData.author,
    });
  } catch (error) {
    console.error("Error receiving font data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all fonts (for admin panel)
app.get("/api/fonts", (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT userId, author, lastUpdate, fontData FROM fonts ORDER BY lastUpdate DESC",
    );
    const rows = stmt.all();

    const fonts = rows.map((row) => ({
      userId: row.userId,
      author: row.author,
      lastUpdate: row.lastUpdate,
      fontData: JSON.parse(row.fontData),
    }));

    res.json(fonts);
  } catch (error) {
    console.error("Error fetching fonts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get font by userId
app.get("/api/fonts/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const stmt = db.prepare(
      "SELECT userId, author, lastUpdate, fontData FROM fonts WHERE userId = ?",
    );
    const row = stmt.get(userId);

    if (!row) {
      return res.status(404).json({ error: "Font not found" });
    }

    const font = {
      userId: row.userId,
      author: row.author,
      lastUpdate: row.lastUpdate,
      fontData: JSON.parse(row.fontData),
    };

    res.json(font);
  } catch (error) {
    console.error("Error fetching font:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete old entries (cleanup every 5 minutes)
if (ENABLE_CLEANUP) {
  setInterval(
    () => {
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const cutoffTime = now - maxAge;

      try {
        const selectStmt = db.prepare(
          "SELECT userId, author FROM fonts WHERE lastUpdate < ?",
        );
        const oldFonts = selectStmt.all(cutoffTime);

        if (oldFonts.length > 0) {
          const deleteStmt = db.prepare(
            "DELETE FROM fonts WHERE lastUpdate < ?",
          );
          const result = deleteStmt.run(cutoffTime);

          oldFonts.forEach((font) => {
            console.log(
              `Cleaned up old font data from: ${font.author} (${font.userId})`,
            );
          });

          console.log(`Cleaned up ${result.changes} old font entries`);
        }
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    },
    5 * 60 * 1000,
  );
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing database...");
  db.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, closing database...");
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Pixelfont server running on http://localhost:${PORT}`);
  console.log(`Ready to receive font data...`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
