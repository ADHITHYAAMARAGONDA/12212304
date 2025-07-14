import Url from "../models/Url.js";
import generateShortcode from "../utils/shortcode.js";

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, shortcode, expiry } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    const expiryDate = expiry
      ? new Date(expiry)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days

    if (isNaN(expiryDate.getTime())) {
      return res.status(400).json({ error: "Invalid expiry date" });
    }

    const code = shortcode || generateShortcode();

    const existing = await Url.findOne({ shortcode: code });
    if (existing) {
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    const newUrl = new Url({
      originalUrl,
      shortcode: code,
      expiry: expiryDate,
    });

    await newUrl.save();

    res.status(201).json({
      message: "Short URL created successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/shorturls/${code}`,
      shortcode: code,
      expiry: expiryDate,
    });
  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const urlEntry = await Url.findOne({ shortcode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > urlEntry.expiry) {
      return res.status(410).json({ error: "Short URL has expired" });
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    return res.redirect(urlEntry.originalUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { shortcode } = req.params;

    const urlEntry = await Url.findOne({ shortcode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Shortcode not found" });
    }

    res.status(200).json({
      originalUrl: urlEntry.originalUrl,
      shortcode: urlEntry.shortcode,
      expiry: urlEntry.expiry,
      clicks: urlEntry.clicks,
      createdAt: urlEntry.createdAt,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
