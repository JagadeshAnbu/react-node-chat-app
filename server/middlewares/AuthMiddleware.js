import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token:", token); // Log the token for debugging
  if (!token) return res.status(401).send("You are not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("Token verification error:", err); // Log error details
      return res.status(403).send("Token is not valid!");
    }
    req.userId = payload?.userId;
    next();
  });
};
