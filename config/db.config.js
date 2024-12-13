const mysql = require('mysql'); // Updated to use 'mysql2' package for better performance and promise support
require('dotenv').config({ path: './configuration.env' });

// Create a pool of connections
const dbConn = mysql.createPool({
    host: process.env.HOST,             
    port: process.env.PORT,        
    user: process.env.USER,        
    password: process.env.PASSWORD,    
    database: process.env.DATABASE,
    waitForConnections: true,           // Enable connection queuing when the pool is exhausted
    connectionLimit: 1,                // Limit the number of simultaneous connections in the pool
    queueLimit: 0,                      // Unlimited request queuing
    connectTimeout: 120000,              // Timeout for establishing a new connection (10 seconds)
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