// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import logger from "./middleware/logger.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(logger);

app.use("/shorturls", urlRoutes);

//connecting to database
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB Error:", err));
