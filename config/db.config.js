const mysql = require('mysql2'); // Updated to use 'mysql2' package for better performance and promise support
require('dotenv').config({ path: './configuration.env' });

// Create a pool of connections
const dbConn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 1, // Reduce connection limit to 1 for serverless functions
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 120000, // Set a reasonable connection timeout (in ms)
});

// Test the database connection
dbConn.getConnection((error, connection) => {
    if (error) {
        console.error('Error connecting to the database:', error.stack);
        process.exit(1);
    } else {
        console.log('DB connected successfully');
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = dbConn;