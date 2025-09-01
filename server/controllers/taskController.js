// server/controllers/taskController.js

import asyncHandler from "express-async-handler";
import Task from "../models/Task.js"; // ✅ Correct default import

// @desc    Get all tasks for a logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 }); // ✅ Use Task.find()
  res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Please add a task title");
  }

  const task = await Task.create({
    // ✅ Use Task.create()
    user: req.user.id,
    title,
    description,
    status: "pending",
  });

  res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id); // ✅ Use Task.findById()

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Ensure logged in user matches task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    // ✅ Use Task.findByIdAndUpdate()
    new: true,
  });

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id); // ✅ Use Task.findById()

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Ensure logged in user matches task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Task.deleteOne({ _id: req.params.id }); // ✅ Use Task.deleteOne()

  res.status(200).json({ id: req.params.id, message: "Task removed" });
});

// ✅ Export all controller functions
export { getTasks, createTask, updateTask, deleteTask };
