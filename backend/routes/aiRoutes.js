const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/resumo', aiController.generateSummary);

module.exports = router;
