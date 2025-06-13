const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const OrderController = require('../controllers/OrderController');

// GET /api/orders - Listar todos os pedidos (com paginação e filtros opcionais)
router.get('/', [
    authenticateToken,
    query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro maior que 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite deve ser entre 1 e 100'),
    query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
        .withMessage('Status deve ser: pending, confirmed, preparing, ready, delivered ou cancelled'),
    validate
], OrderController.getAllOrders);

// POST /api/orders - Criar um novo pedido
router.post('/', [
    authenticateToken,
    body('user_id').isInt({ min: 1 }).withMessage('ID do usuário deve ser um número válido'),
    body('total_amount').isFloat({ min: 0.01 }).withMessage('Total do pedido deve ser maior que zero'),
    body('items').isArray({ min: 1 }).withMessage('Pedido deve ter pelo menos um item'),
    body('items.*.product_name').notEmpty().withMessage('Nome do produto é obrigatório'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro maior que zero'),
    body('items.*.unit_price').isFloat({ min: 0.01 }).withMessage('Preço unitário deve ser maior que zero'),
    body('items.*.total_price').isFloat({ min: 0.01 }).withMessage('Preço total do item deve ser maior que zero'),
    validate
], OrderController.createOrder);

// GET /api/orders/:id - Buscar pedido por ID
router.get('/:id', [
    authenticateToken,
    param('id').isInt({ min: 1 }).withMessage('ID do pedido deve ser um número válido'),
    validate
], OrderController.getOrderById);

// GET /api/orders/user/:userId - Buscar pedidos por ID do usuário
router.get('/user/:userId', [
    authenticateToken,
    param('userId').isInt({ min: 1 }).withMessage('ID do usuário deve ser um número válido'),
    validate
], OrderController.getOrdersByUserId);

// PATCH /api/orders/:id/status - Atualizar status do pedido
router.patch('/:id/status', [
    authenticateToken,
    param('id').isInt({ min: 1 }).withMessage('ID do pedido deve ser um número válido'),
    body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
        .withMessage('Status deve ser: pending, confirmed, preparing, ready, delivered ou cancelled'),
    validate
], OrderController.updateOrderStatus);

module.exports = router; 