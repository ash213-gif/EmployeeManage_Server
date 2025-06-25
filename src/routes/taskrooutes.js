const express = require('express');
const router = express.Router();

const {getTask,createTask ,deleteTask,UpdateTask }=require('../controller/TaskControl');

router.get('/tasks', getTask);
router.post('/createTask', createTask);
router.delete('/deleteTask/:id', deleteTask);
router.put('/updateTask/:id', UpdateTask);

module.exports = router;

