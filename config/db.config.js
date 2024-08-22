const mysql = require('mysql');
require('dotenv').config({ path: './configuration.env' });

const dbConn = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

dbConn.connect(function (error) {
    if (error) {
        console.error('error connecting:' + error.stack);
        process.exit(1);
    }
    else {
        console.log('DB connected successfully');
    }

});

module.exports = dbConn;
