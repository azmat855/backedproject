// ==========================
// controllers/AuthControllers.js
// ==========================

const Users = require("../models/UserModel");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const sendEmailOTP = require("../utils/emailfunction");

const { v4: uuidv4 } = require("uuid");

// ==========================
// SIGNUP CONTROLLER
// ==========================

const signupController = async (
  req,
  res,
  next
) => {
  try {
    const {
      userName,
      email,
      password,
      age,
    } = req.body;

    // VALIDATION
    if (
      !userName ||
      !email ||
      !password ||
      !age
    ) {
      return next(
        new Error("All fields are required")
      );
    }

    // CHECK EXISTING USER
    const existingUser =
      await Users.findOne({ email });

    if (existingUser) {
      const error =
        new Error("User already exists");

      error.statusCode = 409;

      return next(error);
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // GENERATE OTP
    const otpCode =
      uuidv4().slice(0, 6);

    console.log(
      "Generated OTP:",
      otpCode
    );

    // CREATE USER
    const newUser =
      await Users.create({
        userName,
        email,
        password: hashedPassword,
        age,
        otp: otpCode,
      });

    // SEND EMAIL
    const messageByTheTransporter =
      await sendEmailOTP(
        email,
        otpCode
      );

    // REMOVE PASSWORD
    newUser.password = undefined;

    res.json({
      status: true,

      message:
        messageByTheTransporter
          ? "Signup successful and OTP sent to email"
          : "Signup successful but failed to send OTP",

      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// LOGIN CONTROLLER
// ==========================

const loginController = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return next(
        new Error(
          "Email and password required"
        )
      );
    }

    const user =
      await Users.findOne({ email });

    if (!user) {
      const error =
        new Error("User not found");

      error.statusCode = 404;

      return next(error);
    }

    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatched) {
      const error =
        new Error("Invalid password");

      error.statusCode = 401;

      return next(error);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "2m",
      }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupController,
  loginController,
};