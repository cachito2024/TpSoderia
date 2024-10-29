const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesControllers'); // Verifica la ruta

router.get('/', clientesController.getAllClientes); 

router.post('/add', clientesController.addCliente);

router.get('/:id', clientesController.getClienteById);

router.put('/:id', clientesController.updateCliente);

router.put('/:id/delete', clientesController.deleteCliente);

module.exports = router;

///GET: Solicita datos sin modificarlos.
//POST: Envía datos para crear o modificar un recurso.
//PUT: Actualiza un recurso existente o crea uno nuevo.