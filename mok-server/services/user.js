import crypto from 'node:crypto';
import * as db from '../services/db.js';


export async function createUser(userData) {
    const existingUser = db.users.find(u => u.email === userData.email || u.phone_number === userData.phoneNumber);
    if (existingUser) {
        throw new Error("Пользователь с такой почтой или телефоном уже существует");
    }

    const newUser = {
        id: crypto.randomUUID(),
        first_name: userData.first_name,
        middle_name: userData.middle_name || null,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        email: userData.email || null,
        social_media: userData.social_media || null,
        password: `hashed_${userData.password}`,
        role: userData.role || 'user'
    };
    db.users.push(newUser);
    return newUser;
}

export async function findUserBy(criteria) {
    if (criteria.id) return db.users.find(u => u.id === criteria.id);
    if (criteria.email) return db.users.find(u => u.email === criteria.email);
    if (criteria.token) {
        const userId = db.tokens.get(criteria.token);
        if (!userId) return null;
        return db.users.find(u => u.id === userId);
    }
    return null;
}

export async function authenticateUser(email, password) {
    const user = await findUserBy({ email });
    if (user && user.password === password) {
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

export async function assignRole(userId, roleName) {
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error("Пользователь не найден");
    
    const validRoles = ['user', 'psychologist', 'admin', 'content_manager'];
    if (!validRoles.includes(roleName)) throw new Error("Недопустимая роль");

    user.role = roleName;
    return user;
}


export async function createPsychologist(data) {
    
    const newTherapist = {
        id: crypto.randomUUID(),
        ...data
    };
    db.therapists.push(newTherapist);
    return newTherapist;
}

export async function deletePsychologist(id) {
    const index = db.therapists.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Психолог не найден");
    db.therapists.splice(index, 1);
    return { success: true };
}
