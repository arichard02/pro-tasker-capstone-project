import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiration = "24h";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const payload = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign({ data: payload }, secret, {
      expiresIn: expiration,
    });

    res.status(201).json({ token, user: payload });
  } catch (err) {
    console.log(err.message);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(400).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!correctPassword) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const payload = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign({ data: payload }, secret, {
      expiresIn: expiration,
    });

    res.status(200).json({ token, user: payload });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};
