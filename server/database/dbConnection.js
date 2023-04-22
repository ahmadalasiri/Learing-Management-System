const mysql = require("mysql2/promise");

const connection = async () => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "lms",
            port: 3306,
        });
        console.log(`connected as id ${conn.threadId}`);
        return conn;
    } catch (err) {
        console.error(`error connecting: ${err.stack}`);
        process.exit(1);
    }
};

module.exports = connection;
