import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time
    }
  );
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      token: generateToken(user),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const validateToken = asyncHandler(async (req, res) => {
  res.json({
    valid: true,
  }).status(200);
});
