const mysql = require('mysql');
require('dotenv').config({ path: './configuration.env' });

function createNewConnection() {
    return mysql.createConnection({
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        connectTimeout: 120000 // Increased timeout to 2 minutes
    });
}

let dbConn = createNewConnection();

const maxRetries = 20; // Maximum number of retry attempts
let retryCount = 0;

function connectWithRetry() {
    dbConn.connect(function (error) {
        if (error) {
            console.error('Error connecting: ' + error.stack);
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
                
                // Close the previous connection before retrying
                dbConn.end(() => {
                    dbConn = createNewConnection(); // Create a new connection instance
                    setTimeout(connectWithRetry, 2000); // Wait 2 seconds before retrying
                });
            } else {
                console.error('Max retries reached. Exiting process.');
                process.exit(1);
            }
        } else {
            console.log('DB connected successfully');
        }
    });
}

// Initiate the connection process with retry logic
connectWithRetry();

module.exports = dbConn;
