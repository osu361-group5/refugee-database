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

/** this branch executes if you run the from the command line */
if (require.main === module) {
    readAllSqlFromFile('db/schema.sql')
        .then(()=> console.log("created database"));
}


module.exports = readAllSqlFromFile;
