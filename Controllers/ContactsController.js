import mongoose from "mongoose";
import User from "../Models/UserModel.js";
import Message from "../Models/MessagesModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { serchTerm } = req.body;

    if (serchTerm === undefined || serchTerm === null) {
      return res.status(400).json({ message: "Search term is required." });
    }

    const sanitizedSearchTerm = serchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    //   const contacts = await User.find({
    //     $and:[{_id:{$ne:req.userId}},{
    //         $or:[{firstName:regex},{lastName:regex},{email:regex}],
    //     }],
    //   });
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const getContactsForDMList = async (req, res, next) => {
  try {
    let { userId } = req;

    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          email: "$contactInfo.email",
          image: "$contactInfo.image",
          lastMessageTime: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find({_id:{$ne:req.userId}},"firstName lastName _id email");


    const contacts = users.map((user)=>({
      label: user.firstName ? `${user.firstName} ${user.lastName} - ${user.email}` :user.email, value:user._id,
    }))

    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};
