require('dotenv').config(); // TEM QUE SER A PRIMEIRA LINHA
const express = require('express');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// 🔥 APIs
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// 🔥 Rota raiz
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
