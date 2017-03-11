/*
    Use this module in your web tests to automaticaly start a test server
 */

var http = require('http');
var app = require('../../app');
var server;


function getServer(port) {
    if (!server) {
        app.set('port', port);
        server = http.createServer(app);
        server.on('error', function(error) {
            console.log('server error', error);
            throw error;
        });
    }

    return {
        stop: () => server.close(),
        start: () => server.listen(port)
    };
}

module.exports = getServer;

