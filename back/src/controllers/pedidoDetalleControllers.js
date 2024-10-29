const pedidoDetalleModels = require('../models/pedidoDetalleModels');

exports.getAllPedidoDetalles = async (req, res) => {
    try {
        const pedidoDetalle = await pedidoDetalleModels.getAll(); // Llama a tu modelo para obtener todos los barrios
        res.json(pedidoDetalle);
    } catch (err) {
        console.error("Error al obtener barrios:", err);
        res.status(500).json({ message: 'Error al obtener barrios' });
    }
};

exports.getDetallesPorPedido = async (req, res) => {
    const { id } = req.params; // Obtener el ID del pedido
    try {
        const detalles = await pedidoDetalleModels.getByPedidoId(id);
        res.json(detalles);
    } catch (error) {
        console.error("Error al obtener detalles del pedido:", error);
        res.status(500).json({ message: 'Error al obtener detalles del pedido' });
    }
};

exports.modificarDetalles = async (req, res) => {
    console.log("Modificar detalles llamada");
    const { id } = req.params; // ID del pedido
    const { detalles } = req.body; // Detalles de productos a modificar
    console.log("Detalles recibidos:", detalles);
    try {
        for (const detalle of detalles) {
            if (detalle.cantidadPedida == null || detalle.cantidadPedida === '') {
                return res.status(400).json({ message: 'La cantidad pedida no puede ser nula o vacía' });
            }
        }
        await pedidoDetalleModels.updateDetalles(id, detalles);
        res.json({ message: 'Detalles modificados exitosamente' });
    } catch (error) {
        console.error("Error al modificar detalles del pedido:", error);
        res.status(500).json({ message: 'Error al modificar detalles del pedido' });
    }
};

exports.agregarDetalle = async (req, res) => {
    const detalles = req.body;

    // Validación: Verificar si recibiste un array de detalles
    if (!Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ message: 'Debe enviar al menos un detalle' });
    }

    try {
        // Iterar sobre cada detalle y verificar los campos
        for (const detalle of detalles) {
            const { idPedido, idProducto, cantidadPedido } = detalle;

            if (!idPedido || !idProducto || !cantidadPedido) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Insertar el detalle en la base de datos
            await pedidoDetalleModels.insertDetalle(idPedido, idProducto, cantidadPedido);
        }

        res.status(201).json({ message: 'Detalles agregados exitosamente' });
    } catch (error) {
        console.error('Error al agregar detalles:', error);
        res.status(500).json({ message: 'Error al agregar detalles' });
    }
};
