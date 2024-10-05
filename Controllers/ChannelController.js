import mongoose from "mongoose";
import Channel from "../Models/ChannelModel.js";
import User from "../Models/UserModel.js";

// export const createChannel = async (req, res, next) => {
//   try {
//     const { name, members } = req.body;
//     const userId = req.userId;

//     // Log members to check if the array is coming as expected
//     //   console.log("Received members:", members); // Debug log

//     const admin = await User.findById(userId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin user not found." });
//     }

//     // Check for valid members
//     const validMembers = await User.find({ _id: { $in: members } });
//     //   console.log("Valid members:", validMembers); // Debug log

//     if (validMembers.length !== members.length) {
//       return res.status(400).json({ message: "Some members are not found." });
//     }

//     const newChannel = new Channel({
//       name,
//       members,
//       admin: userId,
//     });

//     await newChannel.save();

//     return res.status(201).json({
//       message: "Channel created successfully.",
//       channel: newChannel,
//     });
//   } catch (error) {
//     //   console.log("Error in createChannel controller", error);
//     return res.status(500).json({ message: error || "Internal server error" });
//   }
// };
export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    // Check if the members array is not empty
    if (!members || members.length === 0) {
      return res.status(400).json({ message: "At least one member must be included." });
    }

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // Check for valid members
    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: "Some members are not found." });
    }

    const newChannel = new Channel({
      name,
      members: validMembers.map(member => member._id), // Use valid member IDs
      admin: userId,
    });

    await newChannel.save();

    return res.status(201).json({
      message: "Channel created successfully.",
      channel: newChannel,
    });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const getUserChannel = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ channels });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const getChannelMessage = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    // console.log('channel controlelr channelId',channelId);
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",  // Customize fields as needed
      },
    });
    //  console.log('channel data',channel);
    if (!channel) {
      return res.status(404).json({ message: "Channel Not Found" });
    }

    const messages = channel.messages;

    return res.status(201).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};
