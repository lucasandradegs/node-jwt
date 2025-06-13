const dashboardService = require('../services/DashboardService');

class DashboardController {
    async getStats(req, res) {
        try {
            const stats = await dashboardService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

module.exports = new DashboardController(); 