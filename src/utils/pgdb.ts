import Client from "pg";

const pgClient = new Client.Client({
    host: "localhost",
    user: "pguser",
    port: 5432,
    password: "Pass@1234",
    database: "company"
});

pgClient.connect();
export default pgClient;