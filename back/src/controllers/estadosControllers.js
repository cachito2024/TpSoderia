const EstadoModel = require('../models/estadosModels');

exports.getEstados = async (req, res) => {
    try {
        const estados = await EstadoModel.getEstados();
        res.json(estados);
    } catch (error) {
        console.error('Error al obtener estados:', error);
        res.status(500).json({ message: 'Error al obtener estados' });
    }
};