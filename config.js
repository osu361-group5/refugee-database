module.exports = {
    dbHost: process.env.dbHost || 'db',
    dbDatabase: process.env.dbDatabase || 'postgres', 
    dbUser: process.env.dbUser || 'postgres',
    dbPass: process.env.dbPass || 'postgres',
    port: process.env.PORT | 3000
};
/*
module.exports = {
    dbHost: process.env.dbHost || 'ec2-23-23-237-68.compute-1.amazonaws.com',
    dbDatabase: process.env.dbDatabase || 'd3108blvvmu40a',
    dbUser: process.env.dbUser || 'cplhcefkzookat',
    dbPass: process.env.dbPass || '2d8215d6d542c7a90314e0c36ea78b045f4f2167bf911393021f3a183828017f',
    port: process.env.PORT | 5432
};
/*
module.exports = {
    dbHost: process.env.dbHost || 'ec2-23-23-237-68.compute-1.amazonaws.com',
    dbDatabase: process.env.dbDatabase || 'd3108blvvmu40a',
    dbUser: process.env.dbUser || 'cplhcefkzookat',
    dbPass: process.env.dbPass || '2d8215d6d542c7a90314e0c36ea78b045f4f2167bf911393021f3a183828017f',
    port: process.env.PORT | 5432
};*/
