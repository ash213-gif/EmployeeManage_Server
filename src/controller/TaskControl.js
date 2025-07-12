const express = require("express");
const app = express();
const task = require("../Module/TaskSchema");
const User = require("../Module/UserSchem");
const mongoose = require("mongoose");


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
exports.getTaskCounts = async (req, res) => {
  try {
    const { userId, year, month, day } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid user ID" });
    }

    // Calculate dates
    const currentDate = new Date();
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const startOfDay = new Date(year, month - 1, day);
    const endOfDay = new Date(year, month - 1, day + 1);

    // Fetch task counts
    const [monthlyTaskCount, dailyTaskCount, yearlyTaskCount] = await Promise.all([
      task.countDocuments({
        assignedTo: userId,
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
      task.countDocuments({
        assignedTo: userId,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      }),
      task.countDocuments({
        assignedTo: userId,
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      }),
    ]);

    return res.status(200).send({
      status: true,
      msg: "Task counts fetched successfully",
      monthlyTaskCount,
      dailyTaskCount,
      yearlyTaskCount,
    });
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};