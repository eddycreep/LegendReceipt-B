const mysql = require('mysql2');
require('dotenv').config({ path: './configuration.env' });

// Create a connection pool with updated settings
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true, // Enable queueing if all connections are in use
    connectionLimit: 5,       // Increase the pool size to handle more connections simultaneously
    queueLimit: 0,            // No limit on the number of queued requests
    ssl: {
        rejectUnauthorized: false, // Allow self-signed SSL certificates
    },
    connectTimeout: 60000,    // Increase connection timeout to 60 seconds
});

// Helper function to retry database connection with exponential backoff
function connectWithRetry(retryCount = 0, maxRetries = 5) {
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1); // Exit the process if maximum retries are reached
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`Error connecting to database (Attempt ${retryCount + 1}/${maxRetries}):`, err);

            // Retry after a delay (exponential backoff)
            const delay = Math.pow(2, retryCount) * 1000; // e.g., 2s, 4s, 8s...
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), delay);
        } else {
            console.log('Database connected successfully.');
            connection.release(); // Release the connection back to the pool
        }
    });
}

// Initialize database connection with retries
connectWithRetry();

module.exports = pool;