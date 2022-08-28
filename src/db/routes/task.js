const express = require("express");
const Tasks = require("../models/task");

const taskRouter = new express.Router();

//create task/////////////////////////////////
taskRouter.post("/tasks", async (req, res) => {
  const task = new Tasks(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
/////////////////////////////////////////////

//get all tasks//////////////////////////////
taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////////////////////////////////////

//get task by id/////////////////////////////
taskRouter.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////////////////////////////////////

//patch task by id///////////////////////////
taskRouter.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const fields = ["description", "completed"];
  const keys = Object.keys(req.body);
  const verify = async () => {
    for (i in keys) {
      if (fields.includes(keys[i]) === false) {
        return false;
      }
    }
    return true;
  };
  try {
    let verification = await verify();
    if (!verification) {
      return res.status(404).send();
    }
    const task = await Tasks.findByIdAndUpdate(_id, req.body, { new: true });
    await task.save();

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////////////////////////////////////

//delete task ///////////////////////////////
taskRouter.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const task = await Tasks.findByIdAndRemove(_id, { new: true });
  if (!task) {
    res.status(404).send();
  }
  res.status(200).send();
  await task.save();
  res.send(task);
});
/////////////////////////////////////////////

module.exports = taskRouter;
