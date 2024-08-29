const mysql = require('mysql');
require('dotenv').config({ path: './configuration.env' });

function createNewConnection() {
    return mysql.createConnection({
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        connectTimeout: 120000 // 2 minutes timeout
    });
}

let dbConn;

function connectWithRetry(retryCount = 0, maxRetries = 20) {
    if (retryCount >= maxRetries) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1);
    }

    dbConn = createNewConnection();

    dbConn.connect((error) => {
        if (error) {
            console.error('Error connecting: ' + error.stack);

            if (error.fatal) {
                console.log('Fatal error occurred, closing connection and retrying...');
                dbConn.end(() => {
                    setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), 2000);
                });
            } else {
                console.log(`Non-fatal error, retrying connection (${retryCount}/${maxRetries})...`);
                setTimeout(() => connectWithRetry(retryCount + 1, maxRetries), 2000);
            }
        } else {
            console.log('DB connected successfully');
        }
    });

    dbConn.on('error', (err) => {
        console.error('MySQL connection error:', err);
        if (err.fatal) {
            console.log('Fatal error occurred, retrying...');
            dbConn.end(() => {
                connectWithRetry(retryCount + 1, maxRetries);
            });
        }
    });
}

// Initial call to establish the connection
connectWithRetry();

module.exports = dbConn;