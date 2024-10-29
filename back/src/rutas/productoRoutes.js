const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoControllers');

// Ruta para obtener todos los estados
router.get('/', productoController.getAllProducto);

module.exports = router; // Exporta el routers