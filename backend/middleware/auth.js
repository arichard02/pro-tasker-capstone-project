import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export async function authMiddleware(req, res, next) {
  try {
    let token = req.headers.authorization;

    // check token exists
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    // check Bearer format
    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // extract token
    token = token.split(" ")[1].trim();

    // ensure secret exists
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    // verify token
    const { data } = jwt.verify(token, secret);

    // attach user to request
    req.user = data;

    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
