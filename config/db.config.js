const mysql = require('mysql2/promise');
require('dotenv').config({ path: './configuration.env' });

/**
 * Create a MySQL connection pool with a specified timeout and other configurations.
 * A pool manages multiple connections efficiently and is recommended for production environments.
 */
const pool = mysql.createPool({
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
    connectTimeout: 10000, // Set a reasonable connection timeout (in ms)
});


/**
 * Helper function to establish a connection with retries if it fails.
 * @param {number} retryCount - Current retry attempt.
 * @param {number} maxRetries - Maximum number of retry attempts.
 */
function connectWithRetry(retryCount = 0, maxRetries = 20) {
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1);
    }

    // Test a connection from the pool
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting connection from pool: ' + error.stack);

            // Retry logic for fatal or recoverable errors
            console.log(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), 2000);
        } else {
            console.log('DB connected successfully');

            // Release the connection back to the pool after a successful test
            connection.release();
        }
    });

    // Handle pool errors
    pool.on('error', (err) => {
        console.error('MySQL pool error:', err);
        if (err.fatal) {
            console.log('Fatal error occurred, retrying connection...');
            setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), 2000);
        }
    });
}

// Initial call to test the pool connection and establish retries if necessary
connectWithRetry();

/**
 * Export the pool object for use throughout the application.
 * Use `pool.query` or `pool.getConnection` for database operations.
 */
module.exports = pool;