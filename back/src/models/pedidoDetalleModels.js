
const database = require('../database');

const pedidoDetalle = {
    getAll: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM Soderia.productoXPedido;');
        return rows;
    },
    getByPedidoId: async (id) => {
        const connection = await database.getConnection();
        const [rows] = await connection.query(`
            SELECT pd.idPedido, pd.idProducto, p.nombre AS nombreProducto, p.cantidadLitros, pd.cantidadPedido
            FROM Soderia.productoXPedido pd
            JOIN Soderia.producto p ON pd.idProducto = p.idProducto
            WHERE pd.idPedido = ?;
        `, [id]);
        return rows;
    },
    updateDetalles: async (idPedido, detalles) => {
        const connection = await database.getConnection();
        try {
            await connection.beginTransaction();

            for (const detalle of detalles) {
                const { idProducto, cantidadPedida, oldIdProducto } = detalle;
                console.log(`Modificando Producto ID: ${idProducto} (anterior: ${oldIdProducto}) con Cantidad: ${cantidadPedida}`);

                // Eliminar el registro anterior si el idProducto ha cambiado o la cantidad ha cambiado
                if (oldIdProducto !== idProducto || cantidadPedida !== detalle.cantidadAnterior) {
                    await connection.query(`
                        DELETE FROM Soderia.productoXPedido
                        WHERE idPedido = ? AND idProducto = ?;
                    `, [idPedido, oldIdProducto]);
                }

                // Insertar el nuevo registro
                await connection.query(`
                    INSERT INTO Soderia.productoXPedido (idPedido, idProducto, cantidadPedido)
                    VALUES (?, ?, ?);
                `, [idPedido, idProducto, cantidadPedida]);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('Error al modificar detalles:', error);
            throw error;
        } finally {
            connection.release(); // Libera la conexión
        }
    }, insertDetalle: async (idPedido, idProducto, cantidadPedido) => {
        const connection = await database.getConnection();
        try {
            const sql = `
                INSERT INTO Soderia.productoXPedido (idPedido, idProducto, cantidadPedido)
                VALUES (?, ?, ?)
            `;
            await connection.query(sql, [idPedido, idProducto, cantidadPedido]);
        } catch (error) {
            console.error('Error al insertar detalle de pedido:', error);
            throw error; // Propagar el error para que sea manejado en el controlador
        }
    }


};




module.exports = pedidoDetalle;
