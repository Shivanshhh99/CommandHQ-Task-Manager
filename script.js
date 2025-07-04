
// Game state
let tasks = [];
let taskId = 0;
let userLevel = 1;
let completedCount = 0;

// DOM elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const userLevelEl = document.getElementById('userLevel');

// Initialize the app
function init() {
    createStars();
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    updateStats();
    showEmptyState();
}

// Create animated stars background
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        taskInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            taskInput.style.animation = '';
        }, 500);
        return;
    }

    const task = {
        id: taskId++,
        text: taskText,
        priority: prioritySelect.value,
        completed: false,
        timestamp: Date.now()
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
    updateStats();
    
    // Add button animation
    addTaskBtn.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
        addTaskBtn.style.animation = '';
    }, 300);
}

// Render all tasks
function renderTasks() {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Create individual task element
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    if (task.completed) {
        taskDiv.classList.add('completed');
    }

    taskDiv.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
        <div class="task-text">${task.text}</div>
        <div class="task-priority ${task.priority}">${task.priority}</div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    return taskDiv;
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        
        if (task.completed) {
            completedCount++;
            checkLevelUp();
        } else {
            completedCount--;
        }
        
        renderTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const taskElement = document.querySelector(`.task-item:nth-child(${taskIndex + 1})`);
        if (taskElement) {
            taskElement.classList.add('removing');
            setTimeout(() => {
                tasks.splice(taskIndex, 1);
                renderTasks();
                updateStats();
            }, 500);
        }
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Animate number changes
    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
    animateNumber(userLevelEl, userLevel);
}

// Animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent);
    if (currentValue !== newValue) {
        element.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.animation = '';
        }, 150);
    }
}

// Check if user should level up
function checkLevelUp() {
    const newLevel = Math.floor(completedCount / 5) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        showLevelUpAnimation();
    }
}

// Show level up animation
function showLevelUpAnimation() {
    userLevelEl.classList.add('level-up-animation');
    
    // Create floating level up text
    const levelUpText = document.createElement('div');
    levelUpText.textContent = 'RANK UP! 🚀';
    levelUpText.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        z-index: 1000;
        animation: levelUpFloat 2s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(levelUpText);
    
    setTimeout(() => {
        userLevelEl.classList.remove('level-up-animation');
        levelUpText.remove();
    }, 2000);
}

// Show empty state
function showEmptyState() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div>No missions available!</div>
                <div>Add your first mission to get started!</div>
            </div>
        `;
    }
}

// Add CSS for shake animation
const shakeCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes levelUpFloat {
        0% { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(1) translateY(-100px);
        }
    }
`;

// Add CSS to head
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);