const express = require('express');
const router = express.Router();
const pedidoDetalleController = require('../controllers/pedidoDetalleControllers');

// Ruta para obtener todos los estados
router.get('/:id', pedidoDetalleController.getDetallesPorPedido);
router.get('/', pedidoDetalleController.getAllPedidoDetalles);
router.put('/:id/modificar', pedidoDetalleController.modificarDetalles);
router.post('/agregar', pedidoDetalleController.agregarDetalle);

module.exports = router; // Exporta el routers