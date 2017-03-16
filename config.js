module.exports = {
    dbHost: process.env.dbHost || 'db',
    dbDatabase: process.env.dbDatabase || 'postgres', 
    dbUser: process.env.dbUser || 'postgres',
    dbPass: process.env.dbPass || 'postgres',
    dbPort: process.env.dbPort || 5432,
    port: process.env.PORT || 3000
};
