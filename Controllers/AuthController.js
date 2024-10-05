import { compare } from "bcrypt";
import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).josn({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    //check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email address",
      });
    }
    //create a new user
    const newUser = new User({ email, password });
    await newUser.save();
    res.cookie("jwt", createToken(email, newUser.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    // console.log("error in signup controller", error);
    return res.status(500).json({ message: error });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this given email not found" });
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(401).json({ message: "Password is InCorrect!!!" });
    }

    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutPassword, // Send the user without the password
    });
  } catch (error) {
    // console.log("error fromn login controller", error);
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    // console.log(req.userId);

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    // console.log("error fromn getuserinfo controller", error);
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName) {
      return res.status(400).json({ message: "First name is required" });
    }
    if (!lastName) {
      return res.status(400).json({ message: "Last name is required" });
    }

    if (color === undefined || color === null) {
      return res.status(400).json({ message: "Color is required" });
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithoutPassword = userData.toObject();
    delete userWithoutPassword.password;
    return res
      .status(200)
      .json({
        message: "Profile Updated Successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const date = Date.now();
    const fileName = "uploads/profiles/" + date + "_" + req.file.originalname;

    // Ensure the file path is correct when renaming
    renameSync(req.file.path, fileName);

    const updatedUser = {
      image: fileName,
    };

    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: "Profile image uploaded successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile image removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt","",{maxAge:1,secure:true,sameSite:'None'})

    return res
      .status(200)
      .json({ message: "Logout Successfully." });
  } catch (error) {
    return res.status(500).json({ message: error || "Internal server error" });
  }
};
