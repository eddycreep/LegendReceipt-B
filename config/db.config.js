const mysql = require('mysql2');
require('dotenv').config({ path: './configuration.env' });


const dbPool = mysql.createPool({
    host: process.env.HOST,             
    port: process.env.PORT,        
    user: process.env.USER,        
    password: process.env.PASSWORD,    
    database: process.env.DATABASE,
    waitForConnections: true,           // Enable connection queuing when the pool is exhausted
    connectionLimit: 10,                // Limit the number of simultaneous connections in the pool
    queueLimit: 0,                      // Unlimited request queuing
    connectTimeout: 10000,              // Timeout for establishing a new connection (10 seconds)
});

// Helper function to test the connection
dbPool.getConnection((err, connection) => {
    console.log('DATABASE CONNECTION: ', {
        "HOST": process.env.HOST,
        "PORT": process.env.PORT,
        "USER": process.env.USER,
        "PASSWORD": process.env.PASSWORD,
        "DATABASE": process.env.DATABASE,
        "state": connection? 'connected' : 'disconnected'
    })

    
    if (err) {
        // Handle specific error types for better debugging
        if (err.code === 'ETIMEDOUT') {
            console.error('Error: Connection to the database timed out.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Error: Connection to the database was refused.');
        } else {
            console.error('Error connecting to the database:', err.stack);
        }
        process.exit(1); // Exit the process on a fatal connection error
    } else {
        console.log('Database connected successfully.');
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = dbPool;