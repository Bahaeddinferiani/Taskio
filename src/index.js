require("./db/mongoose");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const taskRouter = require("./routes/task");
const express = require("express");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(loginRouter);

console.clear();

//listening to server
app.listen(port, () => {
  console.log("listening on port " + port);
});
