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

    beforeEach(function(done) {
        testUtils.beforeTest(process.env.dbDatabase, process.env.dbHost)
            .then((res) => {
                pgpObj = res;
                this.server = testApp(3001);
                this.server.start();
                this.users = queries(pgpObj.db).users;
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
                url: getAbsUrl('auth/login'),
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
                expect(response.statusCode).toEqual(404);
                done();
            });


        });
    });
});