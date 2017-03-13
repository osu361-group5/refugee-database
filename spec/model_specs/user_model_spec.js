var DAOFactory = require('../../db/queries');
var test_utils = require('../test_utils');

describe("User DAO Tests", function() {
    var users;
    var pgpObj;

    /** create the database before each test */
    beforeEach(function(done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
        test_utils
            .beforeTest(process.env.dbDatabase, process.env.dbHost)
            .then((res) => {
                // the promise returns a pgpObj, that you can set locally
                // it will be needed for database destruction and setting up
                // the DAOFactory
                pgpObj = res;
                users = DAOFactory(pgpObj.db).users;
                done();
        })
        .catch((err) => console.log(err) || process.exit(1) );
    });

    afterEach(function(done) {
        test_utils
            // pass the pgpObj to afterTest to end the database connection along
            // with destroying the database
            .afterTest(pgpObj)
            .then(() => {
                // take care of any after things in here
                users = null;
                done();
            });
    });

    /* fixtures */
    var username = 'test';
    var password = 'password';
    var email = 'email';

    it("Should create a user and return an id", function(done) {
        // set up the test
        var username2 = 'test2';
        var email2 = 'email2';

        // do the test thing and assert, since its using promises :|
        users.createUser(username, password, email)
            .then((data)=> {
                expect(data.id).toEqual(1);
            })
            // try a second one, it should be now at count two
            .then(()=> users.createUser(username2, password, email2))
            .then((data) => {
                expect(data.id).toEqual(2);
                done();
            })
            // if something unexpected happens in an asynchronous flow, use done.fail('msg')
            .catch((err) => done.fail(err));
    });

    it("should not create two users with the same username", function(done) {
        var email2 = 'user2@email.com';
        users.createUser(username, password, email)
            .then(() => users.createUser(username, password, email2))
            .then(() => done.fail('created two users with same username'))
            .catch((err) => done());
    });

    it("should not create two users with same email", function(done) {
        var username2 = 'user2';
        users.createUser(username, password, email)
            .then(() => users.createUser(username2, password, email))
            .then(() => done.fail('created two users with same email'))
            .catch((err) => done());
    });

    it("Test utility functions, the id should start at 1 for every test", function(done) {
        users.createUser(username, password, email)
            .then((data) => {
                expect(data.id).toEqual(1);
            })
            .then(()=> done())
            .catch((err) => done.fail(err));
    });

    it("Is able to get correct user by ID", function(done) {
        var username2 = 'test2';
        users.createUser(username2, password, email)
            .then((data) => users.findById(data.id))
            .then((data) => {
                expect(data.username).toEqual(username2);
                expect(data.email).toEqual(email);
            })
            .then(() => done())
            .catch((err) => done.fail(err));
    });

    it("should be able to get user by username", function(done) {
        users.createUser(username, password, email)
            .then(() => users.findUserByUsername(username))
            .then((data) => {
                expect(data.username).toEqual(username);
                expect(data.email).toEqual(email);
            })
            .then(() => done())
            .catch((err) => done.fail(err));
    });

    it("it should store a hashed version of a users password", function(done) {
        users.createUser(username, password, email)
            .then((data) => users.findById(data.id))
            .then((data) => {
                expect(data.password_hash === password).toBeFalsy("passwords are not the same");
                return data.password_hash
            })
            .then((passwordHash) => {
                return require('../../crypto').verifyPassword(passwordHash, password)
            })
            .then((res) => {
                expect(res).toBeTruthy("password hashed incorrectly");
                done();
            })
            .catch((err) => done.fail(err))
    });

});
