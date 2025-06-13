const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const ProductController = require('../controllers/ProductController');

// GET /api/products - Listar todos os produtos (usuários autenticados podem ver)
router.get('/', authenticateToken, ProductController.getAllProducts);

// POST /api/products - Criar um novo produto (apenas ADMIN)
router.post('/', [
    authenticateToken,
    authorizeRole(['ADMIN']),
    body('name').notEmpty().withMessage('Nome do produto é obrigatório'),
    body('price').isFloat({ min: 0.01 }).withMessage('Preço deve ser um número maior que zero'),
    validate
], ProductController.createProduct);

// GET /api/products/:id - Buscar produto por ID (usuários autenticados podem ver)
router.get('/:id', [
    authenticateToken,
    param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser um número válido'),
    validate
], ProductController.getProductById);

// PATCH /api/products/:id - Atualizar produto (apenas ADMIN)
router.patch('/:id', [
    authenticateToken,
    authorizeRole(['ADMIN']),
    param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser um número válido'),
    body('name').optional().isLength({ min: 1 }).withMessage('Nome do produto não pode estar vazio'),
    body('price').optional().isFloat({ min: 0.01 }).withMessage('Preço deve ser um número maior que zero'),
    // Validação customizada para garantir que pelo menos um campo seja fornecido
    body().custom((value, { req }) => {
        if (!req.body.name && !req.body.price) {
            throw new Error('É necessário fornecer pelo menos nome ou preço para atualizar');
        }
        return true;
    }),
    validate
], ProductController.updateProduct);

// DELETE /api/products/:id - Deletar produto (apenas ADMIN)
router.delete('/:id', [
    authenticateToken,
    authorizeRole(['ADMIN']),
    param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser um número válido'),
    validate
], ProductController.deleteProduct);

module.exports = router; 