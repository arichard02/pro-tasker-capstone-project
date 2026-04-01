import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const secret = process.env.JWT_SECRET;
const expiration = "24h";

// REGISTER
router.post("/register", async (req, res) => {
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

    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    res.status(201).json({ token, user: payload });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Incorrect email or password" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect email or password" });

    const payload = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    res.status(200).json({ token, user: payload });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET current logged-in user
router.use(authMiddleware);
router.get("/", (req, res) => {
  res.status(200).json(req.user);
});

export default router;