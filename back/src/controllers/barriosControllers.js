const BarrioModels = require('../models/barriosModels');

exports.getAllBarrios = async (req, res) => {
    try {
        const barrios = await BarrioModels.getAll(); // Llama a  modelo para obtener todos los barrios
        res.json(barrios);
    } catch (err) {
        console.error("Error al obtener barrios:", err);
        res.status(500).json({ message: 'Error al obtener barrios' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const barrio = await BarrioModels.getById(id);
        if (!barrio) {
            return res.status(404).json({ message: 'Barrio no encontrado' });
        }
        res.json({
            localidad: barrio.nombreLocalidad, //  nombre de la localidad
            barrio: barrio // O devuelve el objeto barrio completo 
        });
    } catch (error) {
        console.error("Error al obtener barrio:", error);
        res.status(500).json({ message: 'Error al obtener barrio' });
    }
};


