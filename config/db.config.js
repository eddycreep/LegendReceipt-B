const mysql = require('mysql');
require('dotenv').config({ path: './configuration.env' });

// Create a connection pool with optimized settings
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true, // Allow queueing if all connections are in use
    connectionLimit: 10,      // Increased pool size for better performance under load
    queueLimit: 0,            // No limit on queued requests
    connectTimeout: 120000,   // Increased connection timeout to 120 seconds
    ssl: {
        rejectUnauthorized: false, // Allow connections with self-signed SSL certificates
    },
});

// Retry database connection with exponential backoff
function connectWithRetry(retryCount = 0, maxRetries = 5) {
    console.log('Attempting database connection...');
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1); // Exit if all retries fail
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`Database connection error (attempt ${retryCount + 1}/${maxRetries}):`, err);
            
            // Retry after an exponentially increasing delay
            const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s...
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), delay);
        } else {
            console.log('Database connected successfully.');
            connection.release(); // Release the connection back to the pool
        }
    });
}

// Initialize connection with retries
connectWithRetry();

module.exports = pool;