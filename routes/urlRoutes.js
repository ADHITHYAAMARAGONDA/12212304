import express from "express";
import {
  shortenUrl,
  redirectToOriginal,
  getAnalytics,
} from "../controllers/urlController.js";

const router = express.Router(); //These are api's to post and get.

 router.post("/shorten", shortenUrl);

 router.get("/analytics/:shortcode", getAnalytics);

 router.get("/:shortcode", redirectToOriginal);

export default router;
