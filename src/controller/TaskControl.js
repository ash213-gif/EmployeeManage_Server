const express = require("express");
const app = express();
const task = require("../Module/TaskSchema");
const User = require("../Module/UserSchem");

exports.getTask = async (req, res) => {
  try {
    const tasks = await task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const Data = req.body;
    const { title, description, assignedTo, deadline } = Data;

    const newTask = await new task({
      title,
      description,
      assignedTo,
      deadline,
    });
    await newTask.save();

    const updatedUser = await User.findByIdAndUpdate(
      assignedTo,
      { $push: { Tasks: newTask._id } },
      { new: true }
    );

    return res.status(201).send({
      data: newTask,
      status: true,
      msg: "Task created and assigned to user successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error("Error creating task:", e);
    res.status(500).send({ status: false, msg: e.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }
    return res
      .status(200)
      .send({ status: true, msg: "Task deleted successfully" });
  } catch (e) {
    console.error("Error deleting task:", e);
    res.status(500).json({ status: false, msg: e.message });
  }
};

exports.UpdateTask = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    if (!id) {
      return res
        .status(400)
        .send({ status: false, msg: "Task ID is required" });
    }

    const updatedTask = await task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ status: false, msg: "Task not found" });
    }

    return res
      .status(200)
      .send({
        status: true,
        msg: "Task updated successfully",
        data: updatedTask,
      });
  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};

// get monthly task count

exports.getMonthlyTaskCount = async (req, res) => {
  try {
    const { userId, year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);


    const taskCount = await task.countDocuments({
      assignedTo: userId,
      createdAt: { $gte: startDate, $lt: endDate },
    });

    console.log(taskCount);


    return res.status(200).send({
      status: true,
      msg: "Task count fetched successfully",
      taskCount: taskCount,
    });
    
  } catch (e) {
    console.error("Error fetching task count:", e);
    return res.status(500).send({ status: false, msg: e.message });
  }
};
