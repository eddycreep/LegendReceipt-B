const mysql = require('mysql2');
require('dotenv').config({ path: '.configuration.env' }); // Updated file path

const dbConn = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

dbConn.connect(function (error) {
    if (error) {
        console.error('error connecting invoice conn:' + error.stack);
        process.exit(1);
    }
    else {
        console.log('DB connected successfully');
    }

});

module.exports = dbConn;