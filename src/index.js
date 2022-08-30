require("./db/mongoose");
const userRouter = require("./db/routes/user");
const loginRouter = require("./db/routes/login");
const taskRouter = require("./db/routes/task");
const express = require("express");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(loginRouter);

console.clear();
console.clear();

//listening to server
app.listen(80, () => {
  console.log("listening on port 80");
});
