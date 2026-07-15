import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import urlRoutes from "./src/routes/urlRoutes.js";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// 1. Serve static frontend (MUST be before the catch-all redirect)
app.use(express.static(path.join(__dirname, "public")));

// 2. API Routes (prefixed with /api)
app.use("/api", urlRoutes);

// 3. Redirect Route (catch-all - MUST be defined LAST)
app.use("/", urlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/shorten`);
});
