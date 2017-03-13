/**
 *  Crypto Library Functions
 *
 */

var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    verifyPassword: function (passwordHash, password) {
        return bcrypt.compare(password, passwordHash);
    },
    hashPassword(actualPassword) {
        return bcrypt.hash(actualPassword, saltRounds);
    }
};