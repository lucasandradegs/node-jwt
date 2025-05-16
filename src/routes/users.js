const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const UserController = require('../controllers/UserController');

router.get('/profile', authenticateToken, UserController.getProfile);
router.get('/', authenticateToken, authorizeRole(['ADMIN']), UserController.getAllUsers);
router.patch('/:id/role', authenticateToken, authorizeRole(['ADMIN']), UserController.updateUserRole);

module.exports = router; 