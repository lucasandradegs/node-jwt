const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const adminPassword = bcrypt.hashSync('admin123', 10);
        db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, user) => {
            if (!user) {
                db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                    ['admin', adminPassword, 'ADMIN']);
                console.log('Usuário admin criado com sucesso!');
            }
        });
    });

    console.log('Banco de dados inicializado com sucesso!');
}

module.exports = {
    db,
    initializeDatabase
}; 