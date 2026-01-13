const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    // Input validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ 
        message: "Status must be one of: pending, in-progress, completed" 
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      due_date: due_date || null,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = { userId: req.user.id };

    if (req.query.status) {
      if (!["pending", "in-progress", "completed"].includes(req.query.status)) {
        return res.status(400).json({ 
          message: "Invalid status. Must be: pending, in-progress, or completed" 
        });
      }
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ created_at: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    // Validate status if provided
    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ 
        message: "Status must be one of: pending, in-progress, completed" 
      });
    }

    // Check if task exists and belongs to user
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (due_date !== undefined) updateData.due_date = due_date;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // Check if task exists and belongs to user
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
