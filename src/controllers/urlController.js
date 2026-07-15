import { nanoid } from "nanoid";
import { save, findByCode, exists } from "../models/urlModel.js";

// Helper to validate URL format
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const shorten = async (req, res) => {
  const { longUrl } = req.body;

  // 1. Validate input
  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }
  if (!isValidUrl(longUrl)) {
    return res
      .status(400)
      .json({ error: "Invalid URL format. Include http:// or https://" });
  }

  try {
    // 2. Generate a unique short code (with collision avoidance)
    let shortCode;
    let codeExists = true;
    while (codeExists) {
      shortCode = nanoid(6); // e.g., "V1StGX"
      codeExists = await exists(shortCode);
    }

    // 3. Save to database
    await save(shortCode, longUrl);

    // 4. Send response
    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortCode}`,
      shortCode: shortCode,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const redirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const entry = await findByCode(shortCode);

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    // 302 is temporary redirect (use 301 for permanent)
    res.redirect(302, entry.longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Server error");
  }
};
