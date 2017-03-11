/** queries
 *
 *  Here we use the Database Access Object pattern, because, plain sql is hard to maintain
 *
 *  To use this. In any place that you need a DAO do the following
 *
 *  // get the db instance
 *  var db = require('db')
 *
 *  // explicitly set the database instance
 *  // this is useful for testing situations where
 *  // a test database should be used
 *  var users = require('queries')(db).users
 *
 *  // then you can do this
 *  users.findById(12).then((data)=> res.render('stuff', context=data));
 */

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

const testNGO = {
    id: 1,
    userId: 1,
    name: 'vader'
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

    constructor(db) {
        this.db = db;
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this.db.one("SELECT * FROM user_m WHERE id = $1", [id])
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.oneOrNone("SELECT * FROM user_m WHERE username = $1 ", [username])
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT * FROM user_m")
                .then((data) => resolve(data))
                .catch((err) => reject(data))

        });
    }

    createUser(username, password, email) {
        return new Promise((resolve, reject) => {
            return this.db.one("INSERT INTO user_m (username, password_hash, email) VALUES ($1, $2, $3) returning id", [username, password, email])
              .then((id) => resolve(id))
              .catch((err) => reject(err))
        });
    }
}

class RefugeeDAO {

    constructor(db) {
        this.db = db;
    }

    /**
     * given an id, polls the database for the row corresponding to that id
     * @param id
     * @returns {Promise} that resolves to a row instance
     */
    findById(id) {
        return testRefugee;
    }

    /**
     * gets the refugee instance associated with a particular userId
     * @param userId
     * @returns {Promise} that resolves to a row instance
     */
    findByUserId(userId) {
        return testRefugee;
    }

    /**
     *
     * @param userId
     * @param name
     * @returns {Promise}
     */
    create(userId, name) {
        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO refugee (user_id, name) VALUES ($1, $2) returning id", [userId, name])
                .then((data)=> resolve(data))
                .catch((err)=> reject(err))
        });
    }

    /**
     * gets all the refugees from database
     * @returns {Promise}
     */
    getAllRefugees() {
        return [testRefugee];
    }

    /**
     * gets all associated members for a particular refugee
     * @param id
     * @returns {Promise}
     */
    getAssociatedMembers(id) {
        return associatedMembers;
    }
}


class NGODAO {

    constructor(db) {
        this.db = db;
    }

    /**
     * given an id, polls the database for the row corresponding to that id
     * @param id
     * @returns {Promise} that resolves to a row instance
     */
    findById(id) {
        return testNGO;
    }

    /**
     * gets the refugee instance associated with a particular userId
     * @param userId
     * @returns {Promise} that resolves to a row instance
     */
    findByUserId(userId) {
        return testNGO;
    }

    /**
     *
     * @param userId
     * @param name
     * @returns {Promise}
     */
    create(userId, name) {
        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO ngo (user_id, oranization) VALUES ($1, $2) returning id", [userId, organization])
                .then((data)=> resolve(data))
                .catch((err)=> reject(err))
        });
    }

    /**
     * gets all the refugees from database
     * @returns {Promise}
     */
    getAllNGOs() {
        return [testNGO];
    }

    /**
     * gets all associated members for a particular refugee
     * @param id
     * @returns {Promise}
     */
    getAssociatedMembers(id) {
        return associatedMembers;
    }

    getRefugeesByAssociationWithNGO(name) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT ref.name, rep.creation_date, rep.description, rep.location_name FROM user_m AS u INNER JOIN ngo AS ngo ON ngo.user_id = u.id INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id INNER JOIN report AS rep ON rep.refugee_id = ref.id WHERE u.username = $1", [name])
            .then((data)=> resolve(data))
            .catch((err)=> reject(err))
        });
    }


    findRefugeeAssociatedWithNGOByName(ngo_name, refugee_name) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT u2.username, rep.creation_date, rep.description, rep.location_name FROM user_m AS u INNER JOIN ngo AS ngo ON ngo.user_id = u.id INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id INNER JOIN report AS rep ON rep.refugee_id = ref.id INNER JOIN user_m AS u2 ON u2.id = ref.user_id WHERE u.username = $1 AND u2.username = $2", [ngo_name, refugee_name])
            .then((data)=> resolve(data))
            .catch((err)=> reject(err))
        });
    }
}

module.exports = function(db) {
    // if a db has an attr 'query' assume its a db object
    if (!db.query) {
        throw new Error("DAO\'s need a database connection object");
    }

    return {
        users: new UserDAO(db),
        refugees: new RefugeeDAO(db),
        ngo: new NGODAO(db)
    }
};
