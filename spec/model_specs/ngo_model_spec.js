var DAOFactory = require('../../db/queries');
var test_utils = require('../test_utils');

describe("NGO DAO tests", function() {
    // declare the handle for a refugee/user dao
    var refugees;
    var ngo;
    var users;

    // declare handle for the pgpObj
    var pgpObj;

    // since each refugee needs a user, create a userFixture
    var username = 'testuser';
    var password = 'password';
    var email = 'email@email.com';
    var testUserId;
    beforeEach(function(done) {
        test_utils
            .beforeTest(process.env.dbDatabase, process.env.dbHost)
            .then((res) => {
                // have to set up any dependencies for a refugee
                // which is a user row
                pgpObj = res;
                ngo = DAOFactory(pgpObj.db).ngo;
                refugee = DAOFactory(pgpObj.db).ngo;
                users = DAOFactory(pgpObj.db).users;
                return users.createUser(username, password, email);
            })
            .then((data)=>{
                testUserId = data.id;
                done();
            });
    });


    afterEach(function(done) {
        test_utils
            .afterTest(pgpObj)
            .then(()=> {
                pgpObj = null;
                done();
            })
    });

    it("creates an ngo object", function(done) {
        var name = "united nations";
        ngo.create(testUserId, organization)
            .then((data) => {
                expect(data.id).toEqual(1);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("associate ngo with a refugee", function(done) {
        var ngo_name = "mark";
        var ref_name = "bob";
        var ref_userID;
        var ngoID;
        var refugeeID;

        //ngo user already created with with testUserId, need refugee user
        users.createUser('testuser2', '12345', 'ref@refugee.com');
            .then((data)=>{
                ref_userId = data.id;
            })
            .catch((err)=> done.fail(err));
        //create a refugee associated with testuser2
        refugee.create(ref_userID, ref_name)
            .then((data)=>{
                refugeeID = data.id;
            })
            .catch((err)=> done.fail(err));
        //create NGO with testUserId
        var name = "united nations";
        ngo.create(testUserId, organization)
            .then((data) => {
                ngoID = data.id;
            })
            .catch((err) => done.fail(err));
        //associate ngo and refugee using ids
        ngo.associate(ngoID, refugeeID)
            .then((data)=>{
                expect(data.id).toEqual(1);
                done();
            })
            .catch((err) => done.fail(err));
    });

    });
});