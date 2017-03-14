module.exports = {
    dbHost: process.env.dbHost || 'db',
    dbDatabase: process.env.dbDatabase || 'postgres', 
    dbUser: process.env.dbUser || 'postgres',
    dbPass: process.env.dbPass || 'pass123',
    port: process.env.PORT || 3000
};
