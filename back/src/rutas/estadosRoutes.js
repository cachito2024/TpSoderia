const express = require('express');
const router = express.Router();
const estadosController = require('../controllers/estadosControllers');

// Ruta para obtener todos los estados
router.get('/', estadosController.getEstados);

module.exports = router; // Exporta el router