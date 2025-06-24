const express=require('express');
const app = express();
const  task  =require('../Module/TaskSchema');

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
        const { title, description } = req.body;
        const newTask = new task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).send({ status:false , msg :e.message  });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await task.findByIdAndDelete(id);
        
        if (!deletedTask) {
            return res.status(404).json({ msg : "Task not found" });
        }
        res.status(200).json({ msg : "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ status:false , msg : e.message });
    }
}
