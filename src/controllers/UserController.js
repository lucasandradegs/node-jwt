const userService = require('../services/UserService');

class UserController {
    async getProfile(req, res) {
        try {
            const user = await userService.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            res.json(user.toJSON());
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar perfil' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.findAll();
            res.json(users.map(user => user.toJSON()));
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários' });
        }
    }

    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            const userId = req.params.id;

            if (!['USER', 'ADMIN'].includes(role)) {
                return res.status(400).json({ message: 'Role inválida' });
            }

            const result = await userService.updateRole(userId, role);
            
            if (!result.success) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.json({ message: 'Role atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar role' });
        }
    }
}

module.exports = new UserController(); 