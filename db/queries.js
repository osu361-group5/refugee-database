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

    getRefugeesByAssociatedwithNGO(ngo_name) {
        return new Promis((resolve, reject) => {
            db.manyOrNone("SELECT u2.username, rep.creation_date, rep.description, rep.location_name FROM user_m AS u INNER JOIN ngo AS ngo ON ngo.user_id = u.id INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id INNER JOIN report AS rep ON rep.refugee_id = ref.id INNER JOIN user_m AS u2 ON u2.id = ref.user_id WHERE u.username = $1", [ngo_name])
            .then((data)=> resolve(data))
            .catch((err)=> reject(err))
        });
    }

    findRefugeeAssociateWithNGOByName(ngo_name, refugee_name) {
        return new Promis((resolve, reject) => {
            db.manyOrNone("SELECT u2.username, rep.creation_date, rep.description, rep.location_name FROM user_m AS u INNER JOIN ngo AS ngo ON ngo.user_id = u.id INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id INNER JOIN report AS rep ON rep.refugee_id = ref.id INNER JOIN user_m AS u2 ON u2.id = ref.user_id WHERE u.username = $1 AND u2.username = $2", [ngo_name, refugee_name])
            .then((data)=> resolve(data))
            .catch((err)=> reject(err))
        });
    }
}


module.exports = {
    users: new UserDAO(),
    refugees: new RefugeeDAO()
};
