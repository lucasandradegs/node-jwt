const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const AuthController = require('../controllers/AuthController');

router.post('/register', [
    body('username').notEmpty().withMessage('Username é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    validate
], AuthController.register);

router.post('/login', [
    body('username').notEmpty().withMessage('Username é obrigatório'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    validate
], AuthController.login);

module.exports = router; 