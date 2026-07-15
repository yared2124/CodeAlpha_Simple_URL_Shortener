import express from "express";
import { shorten, redirect } from "../controllers/urlController.js";

const router = express.Router();

// API endpoint: POST /api/shorten
router.post("/shorten", shorten);

// Redirect endpoint: GET /:shortCode (mounted at root)
router.get("/:shortCode", redirect);

export default router;
