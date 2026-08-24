const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// @route GET /api/tasks (Get all tasks for the logged-in user)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// @route POST /api/tasks (Create a new task)
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
            userId: req.user.id // Extracted from the JWT via authMiddleware
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// @route PUT /api/tasks/:id (Update task status)
router.put('/:id', async (req, res) => {
    try {
        const { isCompleted } = req.body;

        // Ensure the task belongs to the user making the request
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isCompleted },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// @route DELETE /api/tasks/:id (Delete a task)
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

module.exports = router;