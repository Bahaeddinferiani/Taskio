require("./db/mongoose");
const userRouter = require("./db/routes/user");
const taskRouter = require("./db/routes/task");
const express = require("express");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

console.clear();
console.log("taskio");
//listening to server
app.listen(80, () => {
  console.log("listening on port 80");
});
