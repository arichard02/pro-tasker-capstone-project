import User from "../models/User.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiration = "24h";

// register
export const registerUser = async (req, res) => {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

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

    res.status(201).json({ token, user });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// login
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const payload = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign({ data: payload }, secret, {
      expiresIn: expiration,
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// get current user
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
