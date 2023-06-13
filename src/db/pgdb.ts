import { Sequelize } from "sequelize";

const connectionString = "postgres://pguser:Pass@1234@localhost:5432/company";
const sequelize = new Sequelize(connectionString, {
  logging: false
})

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

export default sequelize;