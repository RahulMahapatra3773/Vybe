import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js"
import storyRoute from "./routes/story.route.js"
import { app,server } from "./socket/socket.js";
import path from 'path';
dotenv.config();
const PORT = process.env.PORT || 8000;
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corseOptions = {
  origin: process.env.URL,
  credentials: true,
};

app.use(cors(corseOptions));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story",storyRoute);
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
});
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server is Running on PORT: ${PORT}`);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
});
