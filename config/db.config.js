const mysql = require('mysql');
require('dotenv').config({ path: './configuration.env' });

const dbConn = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 120000 // Timeout set to 120 seconds (2 minutes)
});

const maxRetries = 20; // Maximum number of retry attempts
let retryCount = 0;

function connectWithRetry() {
    dbConn.connect(function (error) {
        if (error) {
            console.error('Error connecting: ' + error.stack);
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
                setTimeout(connectWithRetry, 2000); // Wait 2 seconds before retrying
            } else {
                console.error('Max retries reached. Exiting process.');
                process.exit(1);
            }
        } else {
            console.log('DB connected successfully');
        }
    });
}

connectWithRetry();

module.exports = dbConn;
