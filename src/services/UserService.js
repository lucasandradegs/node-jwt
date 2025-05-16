const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const User = require('../models/User');

class UserService {
    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [userData.username, hashedPassword, 'USER'],
                function(err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, username: userData.username, role: 'USER' });
                }
            );
        });
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows.map(row => new User(row)));
            });
        });
    }

    async updateRole(userId, newRole) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET role = ? WHERE id = ?',
                [newRole, userId],
                function(err) {
                    if (err) reject(err);
                    resolve({ success: this.changes > 0 });
                }
            );
        });
    }

    async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
}

module.exports = new UserService(); 