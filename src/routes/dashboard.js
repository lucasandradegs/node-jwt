const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const DashboardController = require('../controllers/DashboardController');

router.get('/stats', authenticateToken, DashboardController.getStats);

module.exports = router; 