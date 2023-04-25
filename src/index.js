const express = require("express");
const userRouter = require("./routers/user");
const employeeRouter = require("./routers/employee");

const app = express();
const port = 3001;
app.use(express.json()); // Middleware for json
app.use(userRouter);
app.use(employeeRouter);


app.listen(port, () => console.log(`App is running on port ${port}`));
