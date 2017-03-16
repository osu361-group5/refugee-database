/**
 * Contains helper functions for testing
 */

const defaultDB = 'postgres';
const dbUtils = require('../../db/util');
const config = require('../../config');

var db, pgp, testPGP, testDB;

/**
 * Singleton that makes a connection with the database
 * and returns an instance of that instance
 * @param dbHost
 * @returns {Object} the db object
 */
function createDefaultDBConnection(dbHost) {
    // if db is already created and is not null, use it
    if (!db) {
        var connectionString = `postgres://postgres:postgres@${dbHost}:5432/${defaultDB}`;
        pgp = require('pg-promise')();
        db = pgp(connectionString);
    }
    return db;
}

/**
 * creates the database specified by databaseName
 * if a database already exists by that name, nothing happens
 * if an error occurs, an error is thrown
 * postgres is assumed to be used so the connection database will be
 * postgres. If this does not exist, then it will error
 *
 * @param databaseName name of database to delete
 * @param dbHost host that runs db
 */
function createDatabase(databaseName, dbHost) {
    db = createDefaultDBConnection(dbHost);
    return new Promise((resolve, reject) => {
        db.oneOrNone('SELECT * FROM pg_database WHERE datname = $1', [databaseName])
            .then((data) => {
                if (!data || ('length' in data && data.length === 0)) {
                    return db.none(`CREATE DATABASE ${databaseName}`)
                } else {
                    resolve(db.done);
                }
            })
            .then(() => resolve(db.done))
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    });
}

/**
 * destroys the database given by databaseName
 *
 * @param databaseName
 * @param dbHost
 * @returns {Promise}
 */
function dropDatabase(databaseName, dbHost) {
    var db = createDefaultDBConnection(dbHost);
    return new Promise((resolve, reject) => {
        return db.none(`DROP DATABASE ${databaseName}`)
            .then(()=> {
                resolve(pgp.end());
            })
            .catch((err) => reject(err))
    });
}

/**
 * Given an object that contains the specified parameters, this returns a
 * database connection using pg-promise
 *
 * @param dbDatabase
 * @param dbPort
 * @param dbPassword
 * @param dbUser
 * @param dbHost
 * @returns {Object} the pgp object
 */
function getTestDatabase({
    dbDatabase,
    dbPort,
    dbPass,
    dbUser,
    dbHost}) {
    var connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbDatabase}`;
    if (!testPGP) {
        testPGP = require('pg-promise')();
        testDB = testPGP(connectionString)
    }
    return {pgp: testPGP, db: testDB};
}

/**
 * sets up environment for a test.  Call this in a beforeSetup function in your test suite
 * returns {Object} that contains
 */
function beforeTest(dbDatabase, dbHost) {
    var res;
    return new Promise((resolve, reject) => {
        createDatabase(dbDatabase, dbHost)
            .then(()=> {
                res = getTestDatabase(config);
                return dbUtils('./db/schema.sql', res.db);
            })
            .then(() => resolve(res))
            .catch((err) => console.log(err) || process.exit(1));
    })
}

function afterTest(pgpObj) {
    pgpObj.pgp.end();
    return dropDatabase(process.env.dbDatabase, process.env.dbHost);

}

module.exports = {
    beforeTest,
    afterTest,
    getTestDatabase,
    dropDatabase,
    createDatabase
};