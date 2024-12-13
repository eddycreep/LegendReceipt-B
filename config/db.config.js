const mysql = require('mysql2'); // Updated to use 'mysql2' package for better performance and promise support
require('dotenv').config({ path: './configuration.env' });

// Create a pool of connections
const dbConn = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 120000
});

// Function to test database connection with retries
async function testDbConnection(retries = 5) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const connection = await dbConn.promise().getConnection();
            console.log('DB connected successfully');
            connection.release(); // Release the connection back to the pool
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === retries) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying connection in ${attempt} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Exponential backoff
        }
    }
}

// Call the function to test the database connection
testDbConnection();

module.exports = dbConn;