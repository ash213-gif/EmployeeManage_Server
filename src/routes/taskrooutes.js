const express = require('express');
const router = express.Router();

const {getTask,createTask ,deleteTask,UpdateTask  , getMonthlyTaskCount}=require('../controller/TaskControl');
const {TaskAuth }=require('../Middleware/AuthTask')

router.get('/tasks', getTask);
router.post('/createTask', TaskAuth , createTask);
router.delete('/deleteTask/:id', deleteTask);
router.put('/updateTask/:id', UpdateTask);

//  monthly count 

router.get('/getMonthlyTaskCount/:userId/:year/:month', getMonthlyTaskCount);

module.exports = router;

