
const database = require('../database');

const Producto = {
    getAll: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM Soderia.producto;');
        return rows;
    },

};

module.exports = Producto;
