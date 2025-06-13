const orderService = require('../services/OrderService');

class OrderController {
    async createOrder(req, res) {
        try {
            const orderData = req.body;
            const result = await orderService.createOrder(orderData);
            res.status(201).json(result);
        } catch (error) {
            if (error.message.includes('obrigatório') || 
                error.message.includes('deve ter pelo menos') ||
                error.message.includes('deve ser maior') ||
                error.message.includes('campos do item')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getAllOrders(req, res) {
        try {
            const { page, limit, status } = req.query;
            const options = {};
            
            if (page) options.page = parseInt(page);
            if (limit) options.limit = parseInt(limit);
            if (status) options.status = status;
            
            const result = await orderService.getAllOrders(options);
            res.json(result);
        } catch (error) {
            console.error('Erro ao buscar todos os pedidos:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            res.json(order);
        } catch (error) {
            if (error.message === 'Pedido não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            console.error('Erro ao buscar pedido:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async getOrdersByUserId(req, res) {
        try {
            const { userId } = req.params;
            const orders = await orderService.getOrdersByUserId(userId);
            res.json(orders);
        } catch (error) {
            console.error('Erro ao buscar pedidos do usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!status) {
                return res.status(400).json({ message: 'Status é obrigatório' });
            }

            const result = await orderService.updateOrderStatus(id, status);
            res.json(result);
        } catch (error) {
            if (error.message === 'Pedido não encontrado') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'Status inválido') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao atualizar status do pedido:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

module.exports = new OrderController(); 