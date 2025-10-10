import crypto from 'node:crypto'
import * as db from './db.js'


export async function createUser(userData) {
  const existingUser = db.users.find(u => u.email === userData.email || u.phone_number === userData.phoneNumber);
  if (existingUser) {
    throw new Error("Пользователь с такой почтой или телефоном уже существует");
  }
  const newUser = {
    id: crypto.randomUUID(),
    firstName: userData.first_name,
    middleName: userData.middle_name || null,
    lastName: userData.last_name,
    phoneNumber: userData.phone_number,
    email: userData.email || null,
    socialMedia: userData.social_media || null,
    password: `hashed_${userData.password}`,
  };

  db.users.push(newUser);
  return newUser;
}

export async function findUserBy(criteria) {
  if (criteria.id) {
    return db.users.find(u => u.id === criteria.id);
  }
  if (criteria.email) {
    return db.users.find(u => u.email === criteria.email);
  }
  if (criteria.token) {
    const userId = tokenStore.get(criteria.token);
    if (!userId) return null;
    return db.users.find(u => u.id === userId);
  }
  return null;
}

export async function authenticateUser(email, password) {
  const user = await findUserBy({ email });
  const hashedPassword = `hashed_${password}`;

  if (user && user.password === hashedPassword) {
    return user;
  }
  return null;
}


export function generateTokenForUser(userId) {
  const token = crypto.randomUUID();
  db.tokens.set(token, userId);
  return token;
}


export function invalidateToken(token) {
  db.tokens.delete(token);
}