import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    console.log("Register API Called");
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("existingUser:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    console.log("Generated Salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      Token: "",
    });
    console.log("New User Object:", newUser);

    await newUser.save();
    console.log("User saved successfully!");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//->->->->->->->->->->->->->->->->->->->->->->->->->->->

export const loginUser = async (req, res) => {
  try {
    console.log("Login API Called");
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("existingUser:", existingUser);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log("Password Valid:", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    console.log("token: ", token);

    const updateduser = await User.findOneAndUpdate(
      { email: existingUser.email },
      { $set: { Token: token } },
      { returnDocument: "after" }
    );

    console.log("updateduser: ", updateduser);
    res
      .status(200)
      .json({ message: "Login successful", token, data: existingUser });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//->->->->->->->->->->->->->->->->->->->->->->->->->->->

export async function authenticate(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({
      message: "Token verified successfully",
      decodedToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

//->->->->->->->->->->->->->->->->->->->->->->->->->->->
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-password"); // -password to exclude passwords from response

    // If no users are found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res
      .status(200)
      .json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Error in getting users data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//->->->->->->->->->->->->->->->->->->->->->->->->->->
export const searchUsers = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.query; // Get search parameters from query

    // Build search conditions
    const searchConditions = {};

    if (firstName) {
      searchConditions.firstName = { $regex: firstName, $options: "i" }; // Case insensitive search
    }
    if (lastName) {
      searchConditions.lastName = { $regex: lastName, $options: "i" }; // Case insensitive search
    }
    if (email) {
      searchConditions.email = { $regex: email, $options: "i" }; // Case insensitive search
    }

    // Find users based on search conditions
    const users = await User.find(searchConditions).select("-password"); // Exclude password from the result

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found matching your search criteria",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in searching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
