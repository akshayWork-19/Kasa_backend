import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const register = async ({ name, email, password }) => {
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw { status: 409, message: "Email already registered!" };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const userId = result.insertId;

        const token = jwt.sign(
            { id: userId, name, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return { token, user: { id: userId, name, email } };
    } catch (error) {
        if (error.status) throw error; // re-throw your known errors as-is
        throw { status: 500, message: 'Database error. Please try again.' };
    }
};

const login = async ({ email, password }) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            throw { status: 401, message: "Invalid email or password!" }
        }
        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid email or password." };
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
        );

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email },
        };
    } catch (error) {
        if (error.status) throw error; // re-throw your known errors as-is
        throw { status: 500, message: 'Database error. Please try again.' };
    }
};

export {
    login,
    register
}