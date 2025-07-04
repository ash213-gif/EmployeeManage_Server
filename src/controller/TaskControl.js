const express = require('express');
const app = express();
const task = require('../Module/TaskSchema');

exports.getTask = async (req, res) => {
    try {
        const tasks = await task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const User = require('../Module/UserSchem');
exports.createTask = async (req, res) => {
    try {
        const Data = req.body;
        const { title, description, userId } = Data;
        if (!title || !description || !userId) {
            return res.status(400).send({ status: false, msg: 'Title, description, and userId are required' });
        }

        // Create the new task
        const newTask = await new task({ title, description });
        await newTask.save();

        // Assign the task to the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { Tasks: newTask._id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ status: false, msg: 'User not found, but task created' });
        }

        // (Optional) Get the user with populated tasks
        const userWithTasks = await User.findById(userId).populate('Tasks');

        return res.status(201).send({
            data: newTask,
            status: true,
            msg: 'Task created and assigned to user successfully',
           user: userWithTasks // Uncomment if you want to return user with tasks
        });
    } catch (e) {
        console.error("Error creating task:", e);
        res.status(500).send({ status: false, msg: e.message });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ msg: "Task not found" });
        }
      return   res.status(200).send({ status:true, msg: "Task deleted successfully" });
    } catch (e) {
        console.error("Error deleting task:", e);
        res.status(500).json({ status: false, msg: e.message });
    }
}

exports.UpdateTask = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    if (!id) {
      return res.status(400).send({ status: false, msg: 'Task ID is required' });
    }

    const updatedTask = await task.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ status: false, msg: 'Task not found' });
    }

    return res.status(200).send({ status: true, msg: 'Task updated successfully', data: updatedTask });
  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }}

