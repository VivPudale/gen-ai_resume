const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

const create_user = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      message: "All fileds are required",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exist",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating user",
      error: error.message,
    });
  }
};

const login_user = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

const logout_user = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    await blacklistModel.create({
      token,
    });
  }
  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out successfully",
  });
};

const getUser = async (req, res) => {
  try {
    const id = req.user.id;

    if (!id) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const user = await userModel.findById(id);
    res.status(200).json({
      message: "Data fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid credentials",
      error: error.message,
    });
  }
};

module.exports = { create_user, login_user, logout_user, getUser };
