var DAOFactory = require('../../db/queries');
var test_utils = require('../test_utils');

describe("NGO DAO tests", function() {
    // declare the handle for a refugee/user dao
    var refugee;
    var ngo;
    var users;

    // declare handle for the pgpObj
    var pgpObj;

    // since each refugee needs a user, create a userFixture
    var username = 'testuser';
    var password = 'password';
    var email = 'email@email.com';
    var testUserId;
    var ngo_name = "mark";
    var ref_name = "bob";
    var organizationName = "united nations";
    var ngoID;
    var refugeeID;
    var ref_userID;

    beforeEach(function(done) {
        test_utils
            .beforeTest(process.env.dbDatabase, process.env.dbHost)
            .then((res) => {
                // have to set up any dependencies for a refugee
                // which is a user row
                pgpObj = res;
                ngo = DAOFactory(pgpObj.db).ngo;
                refugee = DAOFactory(pgpObj.db).refugees;
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
            .catch((err) => console.log(err) || process.exit(1))
    });

    it("creates an ngo object", function(done) {
        ngo.create(testUserId, organizationName)
            .then((data) => {
                expect(data.id).toEqual(1);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("associate ngo with a refugee", function(done) {
        //ngo user already created with with testUserId, need refugee user
        users.createUser('testuser2', '12345', 'ref@refugee.com')
            .then((data)=>{
                ref_userID = data.id;
            })
            //create a refugee associated with testuser2
            .then(() => refugee.create(ref_userID, ref_name))
            .then((data) => {
                refugeeID = data.id;
            })
            .then(() => {
                //create NGO with testUserId
                return ngo.create(testUserId, organizationName)
            })
            .then((data) => {
                ngoID = data.id;
            })
            .then(() => {
                //associate ngo and refugee using ids
                return ngo.associate(ngoID, refugeeID);
            })
            .then((data) => {
                expect(data.id).toEqual(1);
                done();
            })
            .catch((err)=> done.fail(err));
    });

    it("find refugees associated with an NGO", function(done) {
        var associationId;
        //ngo user already created with testUser, need refugee user
        users.createUser('testuser2', '12345', 'ref@refugee.com')
            .then((data)=>{
                ref_userID = data.id;
            })
            //create a refugee associated with testuser2
            .then(() => refugee.create(ref_userID, ref_name))
            .then((data) => {
                refugeeID = data.id;
            })
            .then(() => {
                //create NGO with testUserId
                return ngo.create(testUserId, organizationName)
            })
            .then((data) => {
                ngoID = data.id;
            })
            .then(() => {
                //associate ngo and refugee using ids
                return ngo.associate(ngoID, refugeeID);
            })
            .then((data) => {
                associationId = data.id;
            })
            .then(() => { 
                return ngo.getRefugeesByAssociationWithNGO(testUserId)
            })
            .then((data) => {
                expect(data[0].id).toEqual(1) && expect(data[0].name).toEqual(ref_name);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("find refugee by name associated with an NGO", function(done) {
        var associationId;
        //ngo user already created with testUser, need refugee user
        users.createUser('testuser2', '12345', 'ref@refugee.com')
            .then((data)=>{
                ref_userID = data.id;
            })
            //create a refugee associated with testuser2
            .then(() => refugee.create(ref_userID, ref_name))
            .then((data) => {
                refugeeID = data.id;
            })
            .then(() => {
                //create NGO with testUserId
                return ngo.create(testUserId, organizationName)
            })
            .then((data) => {
                ngoID = data.id;
            })
            .then(() => {
                //associate ngo and refugee using ids
                return ngo.associate(ngoID, refugeeID);
            })
            .then((data) => {
                associationId = data.id;
            })
            .then(() => {
                return ngo.findRefugeeAssociatedWithNGOByName(testUserId, ref_name)
            })
            .then((data) => {
                expect(data[0].id).toEqual(1) && expect(data[0].name).toEqual(ref_name);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("get all NGOs", function(done) {
        var NGO1 = "UN";
        var NGO2 = "Red Cross";
        var testUserId2;
        var ngoId1;
        var ngoId2;
        //create a refugee associated with testuser
        ngo.create(testUserId, NGO1)
            .then((data) => {
                ngoId1 = data.id;
            })
            //create a second user
            .then(() => {
                return users.createUser('testUser2', 'password', 'email2@email.com')
            })
            .then((data) => {
                testUserId2 = data.id;
            })
            //make second user a refugee
            .then(() => {
                return ngo.create(testUserId2, NGO2)
            })
            .then((data) => {
                ngoId2 = data.id;
            })
            .then(() => {
                return ngo.getAllNGOs()
            })
            .then((data) => {
                expect(data[0].id).toEqual(ngoId1) && expect(data[1].id).toEqual(ngoId2);
                done();
            })
            .catch((err) => done.fail(err));
    });

});
