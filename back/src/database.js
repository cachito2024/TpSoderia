  const mysql = require('mysql2/promise');
    const dotenv = require('dotenv');
    dotenv.config();
    
    let connection;
    
    const getConnection = async () => {
        if (!connection) {
            try {
                connection = await mysql.createConnection({
                    host: process.env.HOST,
                    database: process.env.DATABASE,
                    user: process.env.USER,
                    password: process.env.PASSWORD
                });
                console.log("Conexión a la base de datos establecida");
            } catch (error) {
                console.error("Error al conectar con la base de datos:", error);
                throw error; // Manejar bien el error acá
            }
        }
        return connection;
    };
    
    module.exports = {
        getConnection
    };
    
 /*
    const mysql = require('mysql2/promise');
    const dotenv = require('dotenv');
    dotenv.config();
    
    const pool = mysql.createPool({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD,
        connectionLimit: 10 // Número máximo de conexiones
    });
    
    const getConnection = async () => {
        try {
            const connection = await pool.getConnection();
            console.log("Conexión a la base de datos establecida");
            return connection;
        } catch (error) {
            console.error("Error al conectar con la base de datos:", error);
            throw error; // Manejar bien el error acá
        }
    };
    
    module.exports = {
        getConnection
    }; */
    