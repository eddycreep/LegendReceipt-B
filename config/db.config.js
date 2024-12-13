const mysql = require('mysql2'); // Updated to use 'mysql2' package for better performance and promise support
require('dotenv').config({ path: './configuration.env' });

// Create a pool of connections
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