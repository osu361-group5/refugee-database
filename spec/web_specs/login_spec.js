const request = require('request');
var queries = require('../../db/queries');
var testUtils = require('../test_utils');
var testApp = require('../test_utils/test_app');

var baseUrl = 'http://localhost';
var port = 3001;

function makeJoiner(baseUrl) {
    const url = require('url');
    return function(route) {
        return url.resolve(baseUrl + ':' + port, route);
    }
}


describe("Login Tests", function() {
    var pgpObj;
    var getAbsUrl = makeJoiner(baseUrl);
    var self = this;

    /**
     * helper function to create a user and log them in
     * @param username
     * @param password
     * @param email
     * @returns {Promise.<TResult>}
     */
    function createUserAndLogin(username, password, email, userType) {
        return this.users.createUser(username, password, email)
            .then(() => {
                return new Promise((resolve, reject) =>
                {
                    var reqObj = {
                        url: getAbsUrl('/auth/login'),
                        form: {
                            username: username,
                            password: password
                        }
                    };
                    request.post(reqObj, function (error, response, body) {
                        if (error) reject(error);
                        resolve()
                    })
                })
            })
            .catch((err) => {
                return done.fail(err);
            });
    }

    beforeEach(function(done) {
        testUtils.beforeTest(process.env.dbDatabase, process.env.dbHost)
            .then((res) => {
                pgpObj = res;
                this.server = testApp(3001);
                this.server.start();
                this.daos = queries(pgpObj.db);
                this.users = this.daos.users;
                done();
            })
            .catch((err) => process.exit(1))
    });

    afterEach(function(done) {
        testUtils.afterTest(pgpObj)
            .then(() => {
                pgpObj = null;
                this.server.stop();
                done();
            })
    });

    describe('GET /', function() {
        it('shows login page upon get request', function(done) {
            request.get(getAbsUrl('/'), function(err, response, body) {
                if (err) done.fail(err);
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe('POST /auth/login', function() {
        it('correctly logs in a user', function(done) {
            var username = 'actualuser';
            var password = 'test';
            var email = 'test@e.com';
            var reqObj = {
                url: getAbsUrl('/auth/login'),
                form: {
                    username: username,
                    password: password
                }
            };

            this.users.createUser(username, password, email)
                .then(() => {
                    request.post(reqObj, function (error, response, body) {
                        if (error) done.fail(error);
                        expect(response.statusCode).toEqual(302);
                        done();
                    })
                })
                .catch((err) => {
                    return done.fail(err);
                });
        });

        it('returns error for incorrect logins', function(done) {
            var reqObj = {
                url: getAbsUrl('/auth/login'),
                form: {
                    username: 'test123',
                    password: 'test'
                }
            };

            request.post(reqObj, function(error, response, body) {
                if (error) done.fail(error);
                expect(response.statusCode).toEqual(403);
                expect(body).toContain("Login");
                expect(body).toContain("<form");
                done();
            });
        });
    });

    describe('POST /auth/logout', function() {
        it('should logout a logged-in user', function(done) {
            var username = 'actualuser';
            var password = 'test';
            var email = 'test@e.com';

            createUserAndLogin.bind(this)(username, email, password, "refugee")
                .then(() => {
                    var postReq = {
                        url: getAbsUrl('/auth/logout'),
                        followAllRedirects: true
                    };
                    request.post(postReq, function(error, response, body) {
                        if (error) done.fail(error);
                        expect(response.statusCode).toBe(200);
                        expect(body).toContain("Login");
                        expect(body).toContain("<form");
                        done();
                    });
                })
                .catch((err) => done.fail(err));
        });

        it('should redirect to login if you are not logged in and display error', function(done) {
            var postReq = {
                url: getAbsUrl('/auth/logout'),
                followAllRedirects: true,
                jar: true   // remember cookie for session
            };
            request.post(postReq, function(error, response, body) {
                if (error) done.fail(error);
                expect(response.statusCode).toBe(200);
                expect(body).toContain("Must be logged-in to do that");
                done();
            });
        });

        it("should redirect to ngo dashboard if usertype is ngo", function(done) {
            var postReq = {
                url: getAbsUrl('/auth/login'),
                followAllRedirects: true,
                jar: true,
                form: {
                    username: 'test123',
                    password: 'test'
                }
            };

            var {username, password} = postReq.form;
            var organization = 'organization';
            this.users.createUser(username, password, username+'@email.com')
                .then((data) => {
                    return this.daos.ngo.create(data.id, organization)
                })
                .then(() => {
                    request.post(postReq, function (error, response, body) {
                        if (error) done.fail(error);
                        expect(body).toContain("<legend>View All Refugees</legend>");
                        done();
                    });
                })
                .catch((err) => done.fail(err));
        });

        it("should redirect to refugee dashboard if usertype is refugee", function(done) {
            var postReq = {
                url: getAbsUrl('/auth/login'),
                followAllRedirects: true,
                jar: true,
                form: {
                    username: 'test123',
                    password: 'test'
                }
            };
            var {username, password} = postReq.form;
            var name = 'someref';
            this.users.createUser(username, password, username + '@email.com')
                .then((data) => {
                    return this.daos.refugees.create(data.id, name);
                })
                .then(() => {
                    request.post(postReq, function(error, response, body) {
                        if (error) done.fail(error);
                        expect(body).toContain("<h1>Refugee Dashboard</h1>")
                        done();
                    })
                })
                .catch(err => done.fail(err));

        });
    });
});