/** queries */

const db = require('../db');

const today = new Date();

const testUser = {
    id: 1,
    username: 'test',
    password: 'password',
    email: 'test@email.com',
    createdDate: today
};

const testRefugee = {
    id: 1,
    userId: 1,
    name: 'luke'
};

const associatedMembers = [
    {
        id: 1,
        name: 'rtoo',
        refugeeId: 1,
        associationDate: today
    },
    {
        id: 2,
        name: 'leah',
        refugeeId: 1,
        associationDate: today
    }
];


/**
 * database access object layer
 */
class UserDAO {

    findById(id) {
        return testUser;
    }

    findUserByUsername(username) {
        return testUser;
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            db.manyOrNone("SELECT * FROM user_m")
                .then((data) => resolve(data))
                .catch((err) => reject(data))

        });
    }

    createUser(username, password, email) {
        return new Promise((resolve, reject) => {
            db.one("INSERT INTO user_m (username, password, email) VALUES ($1, $2)", [username, password, email])
              .then((data) => resolve(data.id))
              .catch((err) => reject(err))
        });
    }
}

class RefugeeDAO {
    findById(id) {
        return testRefugee;
    }

    findByUserId(userId) {
        return testRefugee;
    }

    createRefugee(userId, name) {
        return new Promise((resolve, reject) => {
            db.one("INSERT INTO refugee (user_id, name) VALUES ($1, $2)", [userId, name])
                .then((data)=> resolve(date.id))
                .catch((err)=> reject(err))
        });
    }

    getAllRefugees() {
        return [testRefugee];
    }

    getAssociatedMembers(id) {
        return associatedMembers;
    }
}


module.exports = {
    users: new UserDAO(),
    refugees: new RefugeeDAO()
};