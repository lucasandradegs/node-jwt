const authService = require('../services/AuthService');

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await authService.authenticate(username, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Username já existe') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Erro ao criar usuário' });
        }
    }
}

module.exports = new AuthController(); 