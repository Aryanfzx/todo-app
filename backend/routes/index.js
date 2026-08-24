const express = require('express');
const authRoute = require('./authRoute');
const taskRoute = require('./taskRoute');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/tasks', taskRoute);

module.exports = router;