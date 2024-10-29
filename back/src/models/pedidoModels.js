const database = require('../database');

const Pedido = {
    getAll: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query(`
                SELECT 
                p.idPedido,  
                p.fechaPedido,
                CONCAT(c.nombre, ' ', c.apellido) AS nombreCliente,
                c.direccion AS direccionCliente,
                b.nombre AS barrioCliente,
                l.nombre AS localidad,
                p.descripcion AS descripcionPedido,
                ep.nombre AS estadoPedido
            FROM 
                Soderia.pedido p
            JOIN 
                Soderia.cliente c ON p.idCliente = c.idCliente
            JOIN 
                Soderia.barrio b ON c.idBarrio = b.idBarrio
            JOIN 
                Soderia.localidad l ON b.idLocalidad = l.idLocalidad
            JOIN 
                Soderia.EstadoPedido ep ON p.idEstadoPedido = ep.idEstadoPedido
            WHERE 
                p.idEstadoPedido IN (1, 2);  
        `);
        return rows; // Retorna todos los pedidos
    },
    getById: async (id) => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM Soderia.pedido WHERE idPedido = ?', [id]);
        return rows[0];
    },
    updateEstado: async (id, idEstadoPedido) => {
        const connection = await database.getConnection();
        const [result] = await connection.query(`
            UPDATE pedido
            SET idEstadoPedido = ?
            WHERE idPedido = ?;
        `, [idEstadoPedido, id]);
        return result;
    },
    updateById: async (id, updatedData) => {
        const connection = await database.getConnection();
        const [result] = await connection.query(
            'UPDATE pedido SET ? WHERE idPedido = ?',
            [updatedData, id]
        );
        console.log("Resultado de la actualización:", result);
        return result;
    },
    addPedido: async (pedidoData) => {
        const connection = await database.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO Soderia.Pedido (descripcion, fechaPedido, idEstadoPedido, idCliente) VALUES (?, ?, ?, ?)',
                [
                    pedidoData.descripcion,
                    pedidoData.fechaPedido,
                    pedidoData.idEstadoPedido,
                    pedidoData.idCliente
                ]
            );

            return result; // Devuelve el resultado de la consulta
        } catch (error) {
            console.error('Error al insertar cliente:', error);
            throw error; // Lanza el error para que pueda ser manejado en otro lugar
        }
    },
    clienteExiste: async (nombre, apellido, direccion) => {
        const connection = await database.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM Soderia.cliente WHERE nombre = ? AND apellido = ? AND direccion = ?`,
                [nombre, apellido, direccion]
            );
            return rows.length > 0; // Retorna true si ya existe
        } catch (error) {
            console.error('Error al verificar si el cliente existe:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Pedido;