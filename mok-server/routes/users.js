import { Router } from 'express';
import {
  createUser,
  findUserBy,
  authenticateUser,
  generateTokenForUser,
  invalidateToken
} from '../services/user.js';
import { isAuthenticated } from '../lib/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await createUser(req.body);
    const token = generateTokenForUser(user.id);
    res.cookie('access_token', token, { httpOnly: true, secure: false });
    const { password, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(422).json({ detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (!user) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }

  const token = generateTokenForUser(user.id);
  res.cookie('access_token', token, { httpOnly: true, secure: false });

  const { password: _, ...userResponse } = user;
  res.status(200).json(userResponse);
});

router.get('/user', isAuthenticated, (req, res) => {
  const { password, ...userResponse } = req.user;
  res.status(200).json(userResponse);
});

router.post('/logout', (req, res) => {
  const token = req.cookies.access_token;
  if (token) {
    invalidateToken(token);
    res.clearCookie('access_token');
  } else {
     return res.status(401).json({ detail: "User is not authenticated" });
  }
  res.status(200).send();
});

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const isEmail = id.includes('@');

  const user = isEmail ? await findUserBy({ email: id }) : await findUserBy({ id });

  if (!user) {
    return res.status(404).json({ detail: "User not found" });
  }

  const { password, ...userResponse } = user;
  res.status(200).json(userResponse);
});

export default router;