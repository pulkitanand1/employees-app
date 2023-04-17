const {Client} = require('pg');

const pgClient = new Client({
    host: "localhost",
    user: "pguser",
    port: 5432,
    password: "Pass@1234",
    database: "company"
});

pgClient.connect();

module.exports = {pgClient};