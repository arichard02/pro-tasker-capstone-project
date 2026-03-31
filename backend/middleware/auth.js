export const protect = async (req, res, next) => {
  try {
    // Placeholder for authentication (add JWT later)
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};