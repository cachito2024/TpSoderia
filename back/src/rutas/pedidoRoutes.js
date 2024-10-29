const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidoControllers'); // Verifica la ruta

// Ruta para obtener todos los pedidos
router.get('/', pedidosController.getAllPedidos);

// Ruta para obtener un pedido por ID
router.get('/:id', pedidosController.getPedidosById);

// Ruta para eliminar un pedido (cambiar el estado)
router.put('/:id/eliminar', pedidosController.eliminarPedido); // Cambia el estado del pedido

// Ruta para editar un pedido
router.put('/:id/editar', pedidosController.updatePedido);

router.post('/add', pedidosController.addPedido);


module.exports = router; // Exporta el router