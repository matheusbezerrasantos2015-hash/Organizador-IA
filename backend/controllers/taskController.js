const tasks = require('../data/tasksData');

let currentId = 1;

exports.getAllTasks = (req, res) => {
    res.json(tasks);
};

exports.createTask = (req, res) => {
    const { title, priority, startDate, endDate } = req.body;

    const newTask = {
        id: currentId++,
        title,
        priority,
        start_date: startDate,
        end_date: endDate,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
};

exports.toggleTask = (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.sendStatus(404);

    task.completed = !task.completed;
    res.json(task);
};

exports.deleteTask = (req, res) => {
    const index = tasks.findIndex(t => t.id == req.params.id);
    if (index === -1) return res.sendStatus(404);

    tasks.splice(index, 1);
    res.sendStatus(204);
};
