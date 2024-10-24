import mongoose from "mongoose";
import Channel from "../model/ChannelModel.js";
import User from "../model/UserModel.js";

// Create a new channel
export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;
    const admin = await User.findById(userId);
    if (!admin) {
      return response.status(400).json({ message: "Admin user not found." });
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return response
        .status(400)
        .json({ message: "Some members are not valid users." });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    return response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all channels for a user
export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Error getting user channels:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get messages for a specific channel
export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting channel messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a channel
export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, members } = req.body;
    const userId = req.userId;

    // Find the channel to ensure it exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Check if the user is the admin of the channel
    if (channel.admin.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this channel." });
    }

    // Update channel name and members
    if (name) channel.name = name;
    if (members) {
      // Validate the members
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return res.status(400).json({ message: "Some members are not valid users." });
      }
      channel.members = members;
    }

    await channel.save(); // Save the updated channel

    return res.status(200).json({ channel });
  } catch (error) {
    console.error("Error updating channel:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Delete a channel
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.userId;

    // Find the channel to ensure it exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found." });
    }

    // Check if the user is the admin or a member of the channel
    if (channel.admin.toString() !== userId && !channel.members.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this channel." });
    }

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json({ message: "Channel deleted successfully." });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
