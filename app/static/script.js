// 1. Initial Check: See if we are already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log("Token found, loading tasks...");
        showTasksUI();
    }
});

// 2. Authentication (Login/Register)
async function handleAuth(type) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill in both fields");
        return;
    }

    try {
        const response = await fetch(`/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            if (type === 'login') {
                localStorage.setItem('token', data.access_token);
                showTasksUI();
            } else {
                alert("Registration successful! You can now login.");
            }
        } else {
            console.error("Server Error Details:", data);
            alert("Server Error: " + (data.detail || "Action failed"));
        }
    } catch (error) {
        console.error("Network/Connection Error:", error);
        alert("Could not connect to the server. Is uvicorn running?");
    }
}

// 3. UI Toggle
function showTasksUI() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('task-section').classList.remove('hidden');
    fetchTasks();
}

// 4. Fetch All Tasks
async function fetchTasks() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/tasks/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // FIX 1: Handle expired/invalid token (401 Unauthorized)
        if (response.status === 401) {
            alert("Session expired. Please log in again.");
            logout();
            return;
        }

        if (response.ok) {
            const tasks = await response.json();
            const list = document.getElementById('task-list');

            // FIX 2: Prevent XSS — build DOM nodes instead of using innerHTML
            list.innerHTML = '';
            tasks.forEach(t => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task-item';

                const titleSpan = document.createElement('span');
                // Use textContent (NOT innerHTML) to safely display user-provided text
                titleSpan.textContent = t.title;
                if (t.completed) titleSpan.classList.add('completed');

                const btnGroup = document.createElement('div');

                const toggleBtn = document.createElement('button');
                toggleBtn.textContent = t.completed ? 'Undo' : 'Done';
                toggleBtn.onclick = () => toggleTask(t.id, t.completed);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.onclick = () => deleteTask(t.id);

                btnGroup.appendChild(toggleBtn);
                btnGroup.appendChild(deleteBtn);
                taskDiv.appendChild(titleSpan);
                taskDiv.appendChild(btnGroup);
                list.appendChild(taskDiv);
            });
        } else {
            const err = await response.json();
            console.error("Failed to fetch tasks:", err);
            alert("Failed to load tasks: " + (err.detail || "Unknown error"));
        }
    } catch (err) {
        console.error("Error fetching tasks:", err);
        alert("Network error while loading tasks. Please try again.");
    }
}

// 5. Create Task
async function createTask() {
    const titleInput = document.getElementById('task-title');
    const title = titleInput.value.trim();
    const token = localStorage.getItem('token');

    if (!title) {
        alert("Task title cannot be empty.");
        return;
    }

    try {
        const response = await fetch('/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: title })
        });

        if (response.ok) {
            titleInput.value = '';
            fetchTasks();
        } else {
            // FIX 3: Show error feedback to user if task creation fails
            const err = await response.json();
            console.error("Failed to create task:", err);
            alert("Failed to create task: " + (err.detail || "Unknown error"));
        }
    } catch (err) {
        console.error("Error creating task:", err);
        alert("Network error while creating task. Please try again.");
    }
}

// 6. Toggle Task Status (Complete/Undo)
// FIX 4: Added Content-Type header, proper body, and try/catch
async function toggleTask(id, currentStatus) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // Send the toggled completed status to the backend
            body: JSON.stringify({ completed: !currentStatus })
        });

        if (response.status === 401) {
            alert("Session expired. Please log in again.");
            logout();
            return;
        }

        if (!response.ok) {
            const err = await response.json();
            alert("Failed to update task: " + (err.detail || "Unknown error"));
            return;
        }

        fetchTasks();
    } catch (err) {
        console.error("Error toggling task:", err);
        alert("Network error while updating task. Please try again.");
    }
}

// 7. Delete Task
// FIX 5: Added try/catch error handling
async function deleteTask(id) {
    const token = localStorage.getItem('token');
    if (confirm("Delete this task?")) {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                logout();
                return;
            }

            if (!response.ok) {
                const err = await response.json();
                alert("Failed to delete task: " + (err.detail || "Unknown error"));
                return;
            }

            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Network error while deleting task. Please try again.");
        }
    }
}

// 8. Logout
function logout() {
    localStorage.removeItem('token');
    location.reload();
}