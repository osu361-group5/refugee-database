/** db.js */

var pgp = require('pg-promise')();
var {dbHost, dbDatabase, dbPass, dbUser} = require('../config');

var connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:5432/${dbDatabase}`;
var db = pgp(connectionString);

module.exports = db;
