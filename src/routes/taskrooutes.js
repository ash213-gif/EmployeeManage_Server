const express = require('express');
const router = express.Router();

const {getTask,createTask ,deleteTask }=require('../controller/TaskControl');

router.get('/tasks', getTask);
router.post('/createTask', createTask);
router.delete('/deleteTask/:id', deleteTask);

module.exports = router;
