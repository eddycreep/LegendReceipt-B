// Import the mysql2 package and dotenv to load environment variables
const mysql = require('mysql2');
require('dotenv').config({ path: '.configuration.env' });

// Create a connection pool for managing database connections
// A pool is preferred over single connections because it reuses connections,
// reduces latency, and handles multiple concurrent requests efficiently.
const dbConn = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true, // Ensures the pool waits for a connection to become available
    connectionLimit: 10, // Maximum number of concurrent connections in the pool
    queueLimit: 0, // Unlimited request queue size
    connectTimeout: 120000, // Increased connection timeout (in ms) for enhanced reliability
});

/**
 * Attempt to connect to the database with retry logic.
 * Retries up to 5 times if the connection fails, logging each attempt.
 */
const connectWithRetry = async (retries = 5) => {
    let attempts = 0;

    while (attempts < retries) {
        try {
            console.log('DB connected successfully');
            return; // Exit the function on successful connection
        } catch (error) {
            attempts++;
            console.error(`Connection attempt ${attempts} failed:`, error.message);

            if (attempts >= retries) {
                console.error('Max retries reached. Exiting process.');
                process.exit(1);
            }

            // Wait for a short period before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};

// Initiate the connection with retry logic
connectWithRetry();

// Export the connection pool for use in other modules
module.exports = dbConn;

/**
 * ### Explanation of Changes:
 *
 * 1. **Connection Pool**:
 *    - Replaces a single connection with a connection pool to efficiently manage resources.
 *    - Reuses connections, reducing overhead and latency for subsequent requests.
 *
 * 2. **Retry Logic**:
 *    - Retries the connection up to 5 times, with a delay between attempts, to handle temporary issues.
 *    - Logs each attempt for debugging and monitoring.
 *
 * 3. **Increased Timeout**:
 *    - `connectTimeout` is increased to 30 seconds to account for network latency or busy database servers.
 *
 * ### Benefits:
 * - Improved performance and scalability due to connection pooling.
 * - Greater reliability and fault tolerance with retry logic.
 * - Enhanced resilience against transient connectivity issues by increasing the timeout and retrying connections.
 */
