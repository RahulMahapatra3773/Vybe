import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

export const addStory = async (req, res) => {
  try {
    const image = req.file;
    const userId = req.id;

    if (!image || !image.buffer) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Resize image using Sharp
    const optimizedBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;

    // Upload to Cloudinary
    let uploadedImage;
    try {
      uploadedImage = await cloudinary.uploader.upload(fileUri);
    } catch (cloudErr) {
      console.error("❌ Cloudinary Upload Failed:", cloudErr);
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    // Create story in DB
    const newStory = await Story.create({
      author: userId,
      image: uploadedImage.secure_url,
    });

    // Populate author
    const populatedStory = await Story.findById(newStory._id).populate(
      "author",
      "username profilePicture"
    );

    return res.status(201).json({
      success: true,
      message: "Story added successfully",
      story: populatedStory,
    });
  } catch (err) {
    console.error("🔥 Server Error in addStory:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while uploading story",
    });
  }
};

export const getStories = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const following = [...user.following, userId];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
      author: { $in: following },
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    return res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};