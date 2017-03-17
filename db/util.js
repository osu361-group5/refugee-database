const importedDb = require('./db');
const fs = require('fs');

var tableRe = new RegExp("^[A-Z]+ [^;]+;$", 'gm');

/** chainable logging */
function logPromise(...args) {
    return new Promise((resolve, reject) => {
        if (process.env.DEBUG == 1) {
            console.log.apply(null, args);
        }
        resolve();
    });
}

/** reads a sql text and executes arbitrary commands
 * the command results will be discarded
 * CAUTION: will not run triggers in its current form
 *
 * path for sqlFile should be relative to root of project
 */
function readAllSqlFromFile(sqlFile='./db/schema.sql', db=importedDb) {
    return new Promise((resolve, reject) => {
        fs.readFile(sqlFile, 'utf8', (err, data) => {
            if (err) {
                throw new Error('unable to open file');
            }
            data.match(tableRe)
                .reduce((acc, statement) => {
                    return acc
                        .then(()=> db.none(statement))
                        .then(()=> logPromise(`EXECUTED: ${statement}`))
                }, Promise.resolve([]))
                .then(()=> {
                    // return the database used for creation to caller
                    resolve(db);
                })
                .catch((err)=> reject(err));
        });
    });
}

var commands = {
    "create-test-data": createTestData
};

/**
 * creates test data after a database has been made
 * returns: {Promise} chain of promises
 */
function createTestData() {
    var daos = require('./queries')(importedDb);
    var {username, password, email} = daos.testData.testUser;
    var {name} = daos.testData.testRefugee;
    return daos.users.createUser(username, password, email)
        .then((data) => daos.refugees.create(data.id, name))
        .then(() => console.log("test data created"))
        .catch((err) => console.log(err));
}

/** this branch executes if you run the from the command line */
if (require.main === module) {
    readAllSqlFromFile('db/schema.sql')
        .then(()=> console.log("created database"))
        .then(() => {
            // after the database has been created, the dev can specify additional commands
            return process.argv.slice(2)
                .map((d)=> d.slice(2))                      // this will be passed as --some-command
                .filter((d) => d in commands)               // and if they're in the commands obj
                .reduce((chain, d) => {                     // start the promise chain
                    return chain.then(() => commands[d]())
                }, Promise.resolve([]));
        })
        .then(()=> console.log("done") || process.exit(0))
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
}

module.exports = readAllSqlFromFile;
