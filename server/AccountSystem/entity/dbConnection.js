const mysql = module.require('mysql');
const host  = '127.0.0.1';
const user  = 'root';
const password = 'worldofwonder';
const port     = '3306';
const name     = 'account';

var pool = undefined;

var connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    port: port,
    name: name
});

module.exports.dbConnection = connection;

