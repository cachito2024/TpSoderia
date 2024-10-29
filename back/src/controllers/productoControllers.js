const productoModels = require('../models/productoModels');

exports.getAllProducto = async (req, res) => {
    try {
        const producto = await productoModels.getAll(); // Llama  para obtener todos los barrios
        res.json(producto);
    } catch (err) {
        console.error("Error al obtener barrios:", err);
        res.status(500).json({ message: 'Error al obtener barrios' });
    }
};

