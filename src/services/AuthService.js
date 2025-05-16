const jwt = require('jsonwebtoken');
const userService = require('./UserService');

class AuthService {
    async authenticate(username, password) {
        const user = await userService.findByUsername(username);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValidPassword = await userService.validatePassword(user, password);
        
        if (!isValidPassword) {
            throw new Error('Senha inválida');
        }

        const token = this.generateToken(user);
        return { user: user.toJSON(), token };
    }

    async register(userData) {
        const existingUser = await userService.findByUsername(userData.username);
        
        if (existingUser) {
            throw new Error('Username já existe');
        }

        const user = await userService.create(userData);
        const token = this.generateToken(user);
        
        return { user, token };
    }

    generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não está definido no arquivo .env');
        }

        return jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }
}

module.exports = new AuthService(); 