const Pedido = require('../models/pedidoModels');

exports.getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.getAll(); // Llama al método getAll del modelo
        res.json(pedidos);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

exports.getPedidosById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await Pedido.getById(id);

        res.json(pedido);
    } catch (error) {
        console.error("Error al obtener pedido:", error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
}
// Función para eliminar un pedido
exports.eliminarPedido = async (req, res) => {
    const idPedido = req.params.id; // Obtén el ID de los parámetros
    console.debug("aver q hay" + idPedido);
    const idEstadoPedido = 3; //  3 es el estado para "eliminado"

    try {

        const result = await Pedido.updateEstado(idPedido, idEstadoPedido); // Cambia el estado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se pudo actualizar el pedido' });
        }

        res.status(200).json({ message: 'Pedido eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
};

exports.updatePedido = async (req, res) => {
    console.log("Actualizando pedido con ID:", req.params.id);
    const { id } = req.params; // Obtener el ID del pedido
    const updatedData = req.body; //  los datos vienen en el cuerpo de la solicitud
    console.log("Datos a actualizar:", updatedData);
    try {
        const result = await Pedido.updateById(id, updatedData); // Llama al método del modelo
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pedido actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
};

exports.addPedido = async (req, res) => {
    const pedidoData = req.body; // Obtener datos del pedido
    console.log('Datos del pedido recibidos:', pedidoData);

    try {
        pedidoData.descripcion = String(pedidoData.descripcion).trim();
        pedidoData.idEstadoPedido = parseInt(pedidoData.idEstadoPedido, 10); // Convertir  el idBarrio
        pedidoData.idCliente = parseInt(pedidoData.idCliente, 10); // Convertir  el idBarrio
        pedidoData.fechaPedido = new Date(pedidoData.fechaPedido).toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS
        // Crear el pedido
        const result = await Pedido.addPedido(pedidoData);
        res.status(201).json({ message: 'Pedido creado exitosamente', idPedido: result.insertId });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(400).json({ message: 'Error al crear el pedido', error });
    }
};


exports.agregarDetalle = async (req, res) => {
    const { idPedido, idProducto, cantidadPedido } = req.body;

    // Validación de los datos
    if (!idPedido || !idProducto || !cantidadPedido) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        // Llamar al modelo para insertar el nuevo detalle
        await pedidoDetalleModels.insertDetalle(idPedido, idProducto, cantidadPedido);
        res.status(201).json({ message: 'Detalle de pedido agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar detalle de pedido:', error);
        res.status(500).json({ message: 'Error al agregar detalle de pedido' });
    }
};