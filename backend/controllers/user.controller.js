import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing ,plz check!",
        success: false,
      })
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User Already Exists",
        success: false,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    })
  } catch (error) {
    console.log(error);

  }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      })
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId)
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    )
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    }
    return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user
    })
  } catch (error) {
    console.log(error);

  }
}
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true
    })
  } catch (error) {
    console.log(error);

  }
}
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error);

  }
}
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      })
    };
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({
      message: 'profile updated',
      success: true,
      user
    })
  } catch (error) {
    console.log(error);

  }
}
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      })
    };
    return res.status(200).json({
      success: true,
      users: suggestedUsers
    })
  } catch (error) {
    console.log(error);

  }
}
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollowKarunga = req.params.id;
    if (followKrneWala === jiskoFollowKarunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false
      })
    }
    const user = await User.findById(followKrneWala);
    const target = await User.findById(jiskoFollowKarunga);
    if (!user || !target) {
      return res.status(400).json({
        message: "User not found",
        success: false
      })
    }
    const isFollowing = user.following.includes(jiskoFollowKarunga);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKarunga } }),
        User.updateOne({ _id: jiskoFollowKarunga }, { $pull: { followers: followKrneWala } }),
      ])
      return res.status(200).json({ message: "Unfollowed Successfully", success: true })
    }
    else {
      //follow logic
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $addToSet: { following: jiskoFollowKarunga } }),
        User.updateOne({ _id: jiskoFollowKarunga }, { $addToSet: { followers: followKrneWala } }),
      ])
      return res.status(200).json({ message: "Followed Successfully", success: true })
    }
  } catch (error) {
    console.log(error);

  }
}
export const searchUsersAndPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }

    const lowercaseQuery = query.toLowerCase();

    // Fetch all users and posts
    const allUsers = await User.find().select("username profilePicture");
    const allPosts = await Post.find().populate("author", "username profilePicture");

    // Match users by username
    const matchedUsers = allUsers.filter((user) =>
      user.username.toLowerCase().includes(lowercaseQuery)
    );

    // Match posts by caption
    const matchedPosts = allPosts.filter((post) =>
      post.caption?.toLowerCase().includes(lowercaseQuery)
    );

    return res.status(200).json({
      success: true,
      users: matchedUsers,
      posts: matchedPosts,
      totalResults: matchedUsers.length + matchedPosts.length,
    });
  } catch (error) {
    console.log("Search error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getMutualConnections = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const targetUserId = req.params.id;

    if (loggedInUserId === targetUserId) {
      return res.status(400).json({
        message: "Cannot get mutual connections with yourself",
        success: false
      });
    }

    // Get logged-in user's following list
    const loggedInUser = await User.findById(loggedInUserId).select('following');

    // Get target user's followers list
    const targetUser = await User.findById(targetUserId).populate('followers', '_id username profilePicture');

    if (!loggedInUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Find mutual connections: people that logged-in user follows AND who also follow the target user
    const mutuals = targetUser.followers.filter(follower =>
      loggedInUser.following.includes(follower._id)
    );

    return res.status(200).json({
      success: true,
      mutuals,
      count: mutuals.length
    });
  } catch (error) {
    console.log("Error fetching mutual connections:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


