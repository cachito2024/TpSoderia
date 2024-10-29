const database = require('../database');

const Estado = {
    getEstados: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM EstadoPedido');
        return rows; // Devuelve todos los estados
    }
};

module.exports = Estado;