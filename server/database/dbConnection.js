const mysql = require("mysql2/promise");

const connection = async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_DBUSERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DBNAME,
            port: process.env.DB_PORT,
        });
        console.log(`connected as id ${conn.threadId}`);
        return conn;
    } catch (err) {
        console.error(`error connecting: ${err.stack}`);
        process.exit(1);
    }
};

module.exports = connection;
