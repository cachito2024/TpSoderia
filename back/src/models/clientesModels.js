const database = require('../database');

const Cliente = {
    getAll: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query(`
             SELECT 
                c.idCliente,
                c.nombre,
                c.apellido,
                c.direccion,
                c.numeroDocumento,
                c.telefono,
                c.fechaAlta,
                c.email,
                b.nombre AS nombreBarrio,
                l.nombre AS nombreLocalidad  -- Obtener nombre de localidad desde la tabla barrio
            FROM 
                Soderia.cliente c
            JOIN 
                Soderia.barrio b ON c.idBarrio = b.idBarrio
            JOIN 
                Soderia.localidad l ON b.idLocalidad = l.idLocalidad -- Aquí se accede a la localidad
            WHERE 
                c.idEstadoCliente = 1;  -- Filtrar solo clientes activos
        `);
        return rows;
    },
    getById: async (id) => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM Soderia.cliente WHERE idCliente = ?', [id]);
        return rows[0];
    },
    updateById: async (id, updatedData) => {
        const connection = await database.getConnection();
        const [result] = await connection.query(
            'UPDATE Soderia.cliente SET ? WHERE idCliente = ?',
            [updatedData, id]
        );
        return result; // Devuelve el resultado de la consulta
    },
    updateEstado: async (id, idEstadoCliente) => {
        const connection = await database.getConnection();
        const [result] = await connection.query('UPDATE cliente SET idEstadoCliente = ? WHERE idCliente = ?', [idEstadoCliente, id]);
        return result;
    },
    create: async (clienteData) => {
        const connection = await database.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO Soderia.cliente (nombre, apellido, direccion, numeroDocumento, telefono, fechaAlta, idBarrio, email, idEstadoCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    clienteData.nombre,
                    clienteData.apellido,
                    clienteData.direccion,
                    clienteData.numeroDocumento,
                    clienteData.telefono,
                    clienteData.fechaAlta,
                    clienteData.idBarrio,
                    clienteData.email,
                    clienteData.idEstadoCliente
                ]
            );
            return result; // Devuelve el resultado de la consulta
        } catch (error) {
            console.error('Error al insertar cliente:', error);
            throw error; // Lanza el error para que pueda ser manejado en otro lugar
        }
    }, clienteExiste: async (nombre, apellido, direccion) => {
        const connection = await database.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM Soderia.cliente WHERE nombre = ? AND apellido = ? AND direccion = ?',
            [nombre, apellido, direccion]
        );
        return rows.length > 0; // Devuelve true si encuentra un cliente
    }

};


module.exports = Cliente;