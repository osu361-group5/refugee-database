var DAOFactory = require('../../db/queries');
var test_utils = require('../test_utils');

describe("Refugee DAO tests", function() {
    // declare the handle for a refugee/user dao
    var refugees;
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
                refugees = DAOFactory(pgpObj.db).refugees;
                users = DAOFactory(pgpObj.db).users;
                return users.createUser(username, password, email);
            })
            .then((data)=>{
                testUserId = data.id;
                done();
            })
            .catch((err) => console.log(err) || process.exit(1));
    });


    afterEach(function(done) {
        test_utils
            .afterTest(pgpObj)
            .then(()=> {
                refugees = null;
                done();
            })
    });

    it("creates a refugee object", function(done) {
        var name = "some name";
        refugees.create(testUserId, name)
            .then((data) => {
                expect(data.id).toEqual(1);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("associates a person with a refugee", function(done) {
        var name = "some name";
        var associated_name = "family member name";
        refugees.create(testUserId, name)
            .then((data) => {
            expect(data.id).toEqual(1);
    })
        .then(()=> users.addAssociatedMember(name, associated_name))
        .then((data) => {
            expect(data.id).toEqual(1);
        done();
    })
        .catch((err) => done.fail(err));
   
    it("find a user by id", function(done) {
       var name = "frank";
       var refId;
       //create a refugee associated with testuser
       refugees.create(testUserId, name)
           .then((data) => {
               refId = data.id;
           })
           .then(() => {
               return refugees.findByUserId(testUserId)
           })
           .then((data) => {
               expect(data.id).toEqual(refId);
               done();
           })
           .catch((err) => done.fail(err));
    });

    it("get all refugees", function(done) {
        var refname1 = "frank";
        var refname2 = "john";
        var testUserId2;
        var refId1;
        var refId2;
        //create a refugee associated with testuser
        refugees.create(testUserId, refname1)
            .then((data) => {
                refId1 = data.id;
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
                return refugees.create(testUserId2, refname2)
            })
            .then((data) => {
                refId2 = data.id;
            })
            .then(() => {
                return refugees.getAllRefugees()
            })
            .then((data) => {
                expect(data[0].id).toEqual(refId1) && expect(data[1].id).toEqual(refId2);
                done();
            })
            .catch((err) => done.fail(err));
    });

    it("adds a report", function(done) {
       var name = "frank";
       var refId;
       var location_name = 'tahiti';
       var longitude = 123.3185558;
       var latitude = 44.5630283;
       var description = 'im a refugee and need help';
       //create a refugee associated with testuser
       refugees.create(testUserId, name)
           .then((data) => {
               refId = data.id;
           })
           //create a report associated with the refugee
           .then(() => {
               return refugees.addReport(testUserId, location_name, longitude, latitude, description)
           })
           .then((data) => {
               expect(data.id).toEqual(1);
               done();
           })
           .catch((err) => done.fail(err));
    });
});
