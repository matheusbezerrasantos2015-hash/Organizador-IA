const API_URL = 'http://localhost:3000/api';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const btnGenerateSummary = document.getElementById('btn-generate-summary');
const aiResultDiv = document.getElementById('ai-summary-result');
const summaryContent = document.getElementById('summary-content');

const filters = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// ---------------------- INIT ----------------------
document.addEventListener('DOMContentLoaded', fetchTasks);

// ---------------------- TASKS ----------------------
async function fetchTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = '';

    tasks
        .filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        })
        .forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            li.innerHTML = `
    <div class="task-content">
        <h3>${task.title}</h3>
        <div class="task-meta">
        <span class="priority-${task.priority}">
            ${task.priority.toUpperCase()}
        </span>
        •
        ${task.start_date || '—'} → ${task.end_date || '—'}
        </div>
    </div>
    <div class="task-actions">
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
    </div>
    `;


            taskList.appendChild(li);
        });
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = taskInput.value.trim();
    const priority = document.getElementById('priority').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!title) return;

    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            priority,
            startDate,
            endDate
        })
    });

    taskForm.reset();
    fetchTasks();
});

async function toggleTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT' });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
}

// ---------------------- FILTERS ----------------------
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        fetchTasks();
    });
});

// ---------------------- IA ----------------------
btnGenerateSummary.addEventListener('click', async () => {
    btnGenerateSummary.disabled = true;
    btnGenerateSummary.innerText = 'Gerando...';

    const res = await fetch('/api/ai/resumo', { method: 'POST' });
    const data = await res.json();

    summaryContent.innerHTML = formatAIText(data.resumo);
    aiResultDiv.classList.remove('hidden');

    btnGenerateSummary.disabled = false;
    btnGenerateSummary.innerText = '🔮 Gerar resumo inteligente';
});

function formatAIText(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/📌/g, '<strong>📌</strong>');
}

