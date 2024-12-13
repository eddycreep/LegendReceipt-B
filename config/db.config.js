const mysql = require('mysql2');
require('dotenv').config({ path: './configuration.env' });


const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 120000,
});


// Helper function to handle retries when a connection fails
function connectWithRetry(retryCount = 0, maxRetries = 5) {
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1); 
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`Error connecting to database (Attempt ${retryCount + 1}/${maxRetries}):`, err);

            // Retry on error
            setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), 2000);
        } else {
            console.log('Database connected successfully.');
            connection.release(); // Release the connection back to the pool
        }
    });
}


connectWithRetry();


module.exports = pool;