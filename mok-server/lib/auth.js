import {
  findUserBy,
} from '../services/user.js';


export async function isAuthenticated(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ detail: "User is not authenticated" });
  }

  const user = await findUserBy({ token });
  if (!user) {
    return res.status(404).json({ detail: "User not found" });
  }
  req.user = user;
  next();
};
