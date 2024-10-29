const Cliente = require('../models/clientesModels');

exports.getAllClientes = async (req, res) => {
    try {
        const clientes = await Cliente.getAll(); // Llama al método getAll del modelo
        res.json(clientes);
    } catch (err) {
        console.error("Error al obtener clientes:", err);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

exports.getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.getById(id);
        res.json(cliente);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
}

exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const result = await Cliente.updateById(id, updatedData);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    const idEstadoCliente = 2; // Cambiar a inactivo

    try {
        const result = await Cliente.updateEstado(id, idEstadoCliente); // Actualiza el estado del cliente
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
};

exports.addCliente = async (req, res) => {
    const clienteData = req.body;

    console.log('Datos recibidos del cliente:', clienteData);

    try {
        if (!clienteData.numeroDocumento) {
            return res.status(400).json({ message: 'El número de documento es obligatorio.' });
        }
        // Verificar si el cliente ya existe
        const existe = await Cliente.clienteExiste(
            clienteData.nombre,
            clienteData.apellido,
            clienteData.direccion
        );

        if (existe) {
            return res.status(400).json({ message: 'El cliente ya existe con la misma dirección.' });
        }
        if (!clienteData.fechaAlta) {
            return res.status(400).json({ message: 'La fecha alta es obligatoria.' });
        }

        // Convierte a int si es necesario

        clienteData.nombre = String(clienteData.nombre).trim();
        clienteData.apellido = String(clienteData.apellido).trim();
        clienteData.direccion = String(clienteData.direccion).trim();
        clienteData.telefono = String(clienteData.telefono).trim();
        clienteData.email = String(clienteData.email).trim();
        clienteData.fechaAlta = new Date(clienteData.fechaAlta).toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS
        clienteData.numeroDocumento = parseInt(clienteData.numeroDocumento, 10);
        clienteData.idBarrio = parseInt(clienteData.idBarrio, 10); // Convertir también el idBarrio

        // Establecer idEstadoCliente a 1 
        clienteData.idEstadoCliente = clienteData.idEstadoCliente || 1;

        const result = await Cliente.create(clienteData);
        res.status(201).json({ message: 'Cliente creado exitosamente', idCliente: result.insertId });
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(400).json({ message: 'Error al crear el cliente', error });
    }
};

