import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file will be created in the project root
const db = new sqlite3.Database(path.join(__dirname, "../../urls.db"));

// Create the table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    shortCode TEXT PRIMARY KEY,
    longUrl TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
