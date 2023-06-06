import express from "express";
import userRouter from "./routers/user";
import employeeRouter from "./routers/employee";

const app : express.Application = express();

app.use(express.json()); // Middleware for json
app.use(userRouter);
app.use(employeeRouter);
const port = 3001;
app.listen(port, () => console.log(`App is running on port ${port}`));