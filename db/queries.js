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
const crypto = require('../crypto');

const testUser = {
    id: 1,
    username: 'test',
    password: 'password',
    email: 'test@email.com',
    createdDate: today
};

const testNGOUser = {
    id: 2,
    username: 'vader',
    password: 'password',
    email: 'vader@empire.org'
};

const testRefugee = {
    id: 1,
    userId: 1,
    name: 'luke'
};

const testNGO = {
    userId: 2,
    organization: 'The Empire'
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
            return crypto.hashPassword(password)
                .then((hashedPassword) => {
                    return this.db
                        .one("INSERT INTO user_m (username, password_hash, email) VALUES ($1, $2, $3) returning id",
                        [username, hashedPassword, email])
                })
              .then((id) => resolve(id))
              .catch((err) => reject(err))
        });
    }

    addAssociatedMember(refugee_id, associated_name) {
        //var data = this.findUserByUsername(username);
        //this.createUser('test2','pwd','email');
        //this.db.one("INSERT INTO refugee (user_id, name) VALUES ($1, $2) returning id", [1, 'joe']);
        console.log('111got here');
        //this.db.one("INSERT INTO refugee (name) VALUES ($1, $2) returning id", [id, associated_name])
        //var id = data.id;
       // var id = 1;

        // return new Promise((resolve, reject) => {
        //     this.db.one("INSERT INTO refugee (user_id, name) VALUES ($1, $2) returning id", [1, 'joe'])
        //         .then((data) => resolve(data))
        //         .catch((err) => reject(err))
        // });

        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO associated_person (refugee_id, name) VALUES ($1, $2) returning id", [refugee_id, associated_name])
                .then((data) => resolve(data))
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
        return new Promise((resolve, reject) => {
            this.db.one("SELECT * FROM refugee WHERE user_id = $1", [userId])
                .then((data)=> resolve(data))
                .catch((err)=> reject(err))
        });
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
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT * FROM refugee")
                .then((data) => resolve(data))
                .catch((err) => reject(err))
        });
    }

    /**
     * gets all associated members for a particular refugee
     * @param id
     * @returns {Promise}
     */
    getAssociatedMembers(id) {
        return associatedMembers;
    }

    /*
     * adds a report associated with the user_id of a refugee 
     * @param: userId (int)
     * @param: location_name (string)
     * @param: longitude (float)
     * @param: latitude (float)
     * @param: description (text)
     * @returns {Promise}
     */
    addReport(userId, location_name, longitude, latitude, description) {
        var date = new Date();
        var today = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO report (refugee_id, location_name, longitude, latitude, description, edit_date) VALUES ((SELECT id FROM refugee WHERE user_id = $1),$2,$3,$4,$5,$6) returning id",[userId, location_name, longitude, latitude, description, today])
                .then((data)=> resolve(data))
                .catch((err)=> reject(err))
        });
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
    create(userId, organization) {
        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO ngo (user_id, organization) VALUES ($1, $2) returning id", [userId, organization])
                .then((data)=> resolve(data))
                .catch((err)=> reject(err))
        });
    }

    /**
     * gets all the ngos from database
     * @returns {Promise}
     */
    getAllNGOs() {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT * FROM ngo")
                .then((data) => resolve(data))
                .catch((err) => reject(err))
        });
    }

    /*
     * Returns data for refugees associated with an NGO via the refugee_ngo table
     * @param: userId (int)
     * @returns {Promise}
     */
    getRefugeesByAssociationWithNGO(userId) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT ref.id, ref.name FROM ngo AS ngo INNER JOIN refugee_ngo AS refngo ON refngo.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refngo.refugee_id WHERE ngo.user_id = $1", [userId])
            .then((data) => resolve(data))
            .catch((err) => reject(err))
        });
    }

    /*
     * Returns data for refugees associated with an NGO via the refugee_ngo table where the name is refugee_name
     * @param: userId (int)
     * @param: refugee_name (string)
     * @returns {Promise}
     */
    findRefugeeAssociatedWithNGOByName(userId, refugee_name) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT ref.id, ref.name FROM ngo AS ngo INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id WHERE ngo.user_id = $1 AND ref.name = $2", [userId, refugee_name])
            .then((data) => resolve(data))
            .catch((err) => reject(err))
        });
    }

    /*
     * Returns data for refugees associated with an NGO via the refugee_ngo table where the name is refugee_name
     * @param: userId (int)
     * @param: query (string)
     * @returns {Promise}
     */
    searchForRefugee(userId, query) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT ref.id, ref.name FROM ngo AS ngo INNER JOIN refugee_ngo AS refno ON refno.ngo_id = ngo.id INNER JOIN refugee AS ref ON ref.id = refno.refugee_id WHERE ngo.user_id = $1 AND ref.name LIKE '%$2#%'",[userId, query])
               .then((data) => resolve(data))
               .catch((err) => reject(err))
        }); 
    }

    /*
     * Associates an ngo with a refugee in the refugee_ngo table
     * @param: ngoId (int)
     * @param: refugeeId (int)
     * @returns {Promise}
     */
    associate(ngoId, refugeeId) {
        return new Promise((resolve, reject) => {
            this.db.one("INSERT INTO refugee_ngo (refugee_id, ngo_id) VALUES ($1, $2) returning id", [refugeeId, ngoId])
                .then((data) => resolve(data))
                .catch((err) => reject(err))
        });
    }
    
    /*
     * Returns all reports associated with a refugee
     * @param: refugeeId (int)
     * @returns {Promise}
     */
    getReports(refugeeId) {
        return new Promise((resolve, reject) => {
            this.db.manyOrNone("SELECT * FROM report WHERE refugee_id = $1",[refugeeId])
                .then((data) => resolve(data))
                .catch((err) => reject(err))
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
        ngo: new NGODAO(db),
        testData: {
            testUser,
            testRefugee,
            associatedMembers,
            testNGO,
            testNGOUser
        }
    }
};
