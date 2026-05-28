import db from '../config/db.js';

const getAllRooms = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms ORDER BY created_at DESC');
        return rows;
    } catch (error) {
        if (error.status) throw error; // re-throw your known errors as-is
        throw { status: 500, message: 'Database error. Please try again.' };
    }
}

const getRoomById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw { status: 404, message: "Room not found!" }
        }

        return rows[0];
    } catch (error) {
        if (error.status) throw error; // re-throw your known errors as-is
        throw { status: 500, message: 'Database error. Please try again.' };
    }
}

export {
    getAllRooms, getRoomById
}