const express = require('express');
const router = express.Router();
const barriosController = require('../controllers/barriosControllers');

// Ruta para obtener todos los barrios
router.get('/', barriosController.getAllBarrios);

// Ruta para obtener un barrio específico por ID
router.get('/:id', barriosController.getById);

module.exports = router;
