import express from "express";
import userRouter from "./routers/user";
import employeeRouter from "./routers/employee";
import { initModels } from "./db/models/init-models";
import sequelize from "./db/pgdb";

const app : express.Application = express();
app.use(express.json()); // Middleware for json
app.use(userRouter);
app.use(employeeRouter);

initModels(sequelize);
const port = 3001;
app.listen(port, () => console.log(`App is running on port ${port}`));