const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const { authenticateToken } = require('../middleware/auth');

// GET /banner
router.get('/banner', informationController.getBanners);

// GET /services
router.get('/services', 
  authenticateToken,
  informationController.getServices
);

module.exports = router;