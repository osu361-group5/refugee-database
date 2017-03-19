/**
 *  These specs are unit tests for the auth controllers
 * */

var controllers = require('../../controllers/auth');


describe('Auth', function() {
    var sessionKeys = ['isLoggedIn', 'loginError', 'userId', 'username'];

    beforeEach(function() {
        this.req = jasmine.createSpyObj('Request', ['session', 'body']);
        this.req.session = jasmine.createSpyObj('Session', sessionKeys);
        this.res = jasmine.createSpyObj('Response', ['render', 'redirect']);
        this.next = jasmine.createSpy('next');
    });

    describe('logout controller', function() {

        it('should set request session loginError and redirect to login', function() {
            this.req.session.isLoggedIn = false;

            controllers.logout(this.req, this.res, this.next);
            expect(this.req.session.isLoggedIn).toBe(false);
            expect(this.req.session.loginError).toBe("Must be logged-in to do that");
            expect(this.res.redirect).toHaveBeenCalledWith('/auth/login');
        });

        it('should destroy session for logged-in users', function() {
            this.req.session.isLoggedIn = true;
            this.req.session.userId = 1;
            this.req.session.username = 'test';

            controllers.logout(this.req, this.res, this.next);

            expect(this.req.session.isLoggedIn).toBeUndefined();
            expect(this.req.userId).toBeUndefined();
            expect(this.req.session.username).toBeUndefined();
            expect(this.res.redirect).toHaveBeenCalledWith('/auth/login');
        });
    });

    describe('loginForm controller', function() {
        it('should redirect to home if already logged in', function() {
            this.req.session.isLoggedIn = true;

            controllers.loginForm(this.req, this.res, this.next);

            expect(this.res.redirect).toHaveBeenCalledWith('/auth/dashboard');
        });

        it('renders the login form if user not logged in', function() {
            this.req.session.isLoggedIn = false;

            controllers.loginForm(this.req, this.res, this.next);

            expect(this.res.render).toHaveBeenCalledWith('login', {error: jasmine.anything()});
        });
    });

    describe('login controller', function() {
        it('should take already logged in users to dashboard', function() {
            this.req.session.isLoggedIn = true;
            this.req.body = {
                username: 'test',
                password: '1234'
            };

            controllers.login(this.req, this.res, this.next);

            expect(this.res.redirect).toHaveBeenCalledWith('/auth/dashboard');
        });
    });

    describe('/auth/dashboard', function() {
        it('should not allow unauthenticated users', function () {
            this.req.session.isLoggedIn = false;

            controllers.redirectToDashboard(this.req, this.res);

            expect(this.res.redirect).toHaveBeenCalledWith('/auth/login');
        });
    });
});