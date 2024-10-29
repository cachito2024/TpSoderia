
const database = require('../database');

const Barrio = {
    getAll: async () => {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM Soderia.barrio;');
        return rows;
    },
    getById: async (id) => {
        const connection = await database.getConnection();
        const [rows] = await connection.query(`
            SELECT b.*, l.nombre AS nombreLocalidad
            FROM Soderia.barrio b
            JOIN Soderia.localidad l ON b.idLocalidad = l.idLocalidad
            WHERE b.idBarrio = ?;`, [id]);
        return rows[0];
    }
};

module.exports = Barrio;
