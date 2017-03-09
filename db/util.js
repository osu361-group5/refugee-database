const db = require('./db');
const fs = require('fs');
const path = require('path');

var tableRe = new RegExp("^[A-Z]+ [^;]+;$", 'gm');

/** chainable logging */
function logPromise(...args) {
    return new Promise((resolve, reject) => {
        console.log.apply(null, args);
        resolve();
    });
}

/** reads a sql text and executes arbitrary commands
 * the command results will be discarded
 *
 * path for sqlFile should be relative to root of project
 */
function readAllSqlFromFile(sqlFile='./db/schema.sql') {
    console.log('opening sql file: ' + sqlFile);
    fs.readFile(sqlFile, 'utf8', (err, data) => {
        if (err) {
            throw new Error('unable to open file');
        }
        data.match(tableRe)
            .reduce((acc, statement) =>{
                return acc
                    .then(()=> db.none(statement))
                    .then(()=> logPromise(`EXECUTED: ${statement}`))
            }, Promise.resolve([]))
    })
}

/** this branch executes if you run the from the command line */
if (require.main === module) {
    readAllSqlFromFile('db/schema.sql');
}


module.exports = function (sqlFile) {
    readAllSqlFromFile(sqlFile);
};