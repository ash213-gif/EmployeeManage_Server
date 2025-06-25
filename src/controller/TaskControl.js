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


exports.createTask = async (req, res) => {
    try {
        const Data = req.body;
        const { title, description } = Data;
        if (!title || !description) { return res.status(400).send({ status: false, msg: 'Title and description are required' }) }

        const newTask =  await  new task(Data)
       await newTask.save();
      return  res.status(201).send({data:newTask, status:true, msg:'task created successfully ' });
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