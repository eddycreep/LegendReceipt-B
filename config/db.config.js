const mysql = require('mysql2'); // Updated to use 'mysql2' package for better performance and promise support
require('dotenv').config({ path: './configuration.env' });

// Create a pool of connections
const pool = mysql.createPool({
    host: process.env.HOST,        // Database host from environment variables
    port: process.env.PORT,        // Database port from environment variables
    user: process.env.USER,        // Database user from environment variables
    password: process.env.PASSWORD, // Database password from environment variables
    database: process.env.DATABASE, // Database name from environment variables
    waitForConnections: true,      // Ensure requests queue if all connections are busy
    connectionLimit: 10,           // Maximum number of connections in the pool
    queueLimit: 0,                 // No limit to the number of queued connection requests
    connectTimeout: 120000         // 2 minutes timeout for connections
});

// Helper function to handle retries when a connection fails
function connectWithRetry(retryCount = 0, maxRetries = 5) {
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1); // Exit if retries exceed the maximum
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

// Initial call to establish a test connection with retry logic
connectWithRetry();

// Export the pool for reuse across the app
module.exports = pool;