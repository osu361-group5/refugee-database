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

describe("Register", function() {
    var pgpObj;
    var getAbsUrl = makeJoiner(baseUrl);

    beforeEach(function (done) {
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

    afterEach(function (done) {
        testUtils.afterTest(pgpObj)
            .then(() => {
                pgpObj = null;
                this.server.stop();
                done();
            })
    });

    describe('post', function() {
        it("should process a correct form", function(done) {
            var reqObj = {
                url: getAbsUrl('register'),
                form: {
                    username: 'tester',
                    email: 'test@email.com',
                    password: '1234',
                    "user-type": "refugee"
                }
            };
            var self = this;
            request.post(reqObj, function(error, response, body) {
                expect(response.statusCode).toBe(302);
                self.users.findUserByUsername(reqObj.form.username)
                    .then((data) => {
                        if (!data) done.fail("user not created");
                        expect(data.username).toEqual(reqObj.form.username);
                        done();
                    })
                    .catch((err) => done.fail(err));
            });
        });

        it("should reject a incorrect form", function(done) {
            var reqObj = {
                url: getAbsUrl("register"),
                form: {
                    username:"wowowow",
                    email:"wowowowo@cool.com",
                    "user-type":"ngo"
                }
            };
            request.post(reqObj, function(error,response,body) {
                if (error) done.fail(error);
                expect(response.body).toContain("Please make sure you have completed the form correctly.")
                done();
            });
        });

    });
});
