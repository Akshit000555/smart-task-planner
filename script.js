let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ADD TASK
function addTask() {
    let taskName = document.getElementById("taskName").value;
    let dueDate = document.getElementById("dueDate").value;
    let category = document.getElementById("category").value;

    if (taskName === "") {
        alert("Please enter task!");
        return;
    }

    let priority = getPriority(dueDate);

    let taskObj = {
        name: taskName,
        date: dueDate,
        category: category,
        priority: priority,
        completed: false
    };

    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("taskName").value = "";

    renderTasks();
}

// RENDER TASKS
function renderTasks() {

    // SORT BY PRIORITY
    tasks.sort((a, b) => {
        let order = { "High": 1, "Medium": 2, "Low": 3 };
        return order[a.priority] - order[b.priority];
    });

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        // CATEGORY COLOR
        if (task.category === "Study") taskDiv.classList.add("study");
        else if (task.category === "Work") taskDiv.classList.add("work");
        else taskDiv.classList.add("personal");

        // COMPLETED STYLE
        if (task.completed) taskDiv.classList.add("completed");

        // 🔥 MAIN FIX (CONTENT SHOW KARNA)
        taskDiv.innerHTML = `
            <span onclick="toggleComplete(${index})" style="cursor:pointer;">
                ${task.completed ? "✔️" : "⬜"}
            </span>

            <b>${task.name}</b> (${task.category}) - ${task.date}
            [${task.priority}]

            <button onclick="deleteTask(${index})">❌</button>
        `;

        taskList.appendChild(taskDiv);
    });

    updateDashboard();
}

// COMPLETE TASK
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// DELETE TASK
function deleteTask(index) {
    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// DASHBOARD UPDATE
function updateDashboard() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;

    document.getElementById("total").innerText = total;
    document.getElementById("completed").innerText = completed;
    document.getElementById("pending").innerText = pending;
}

// PRIORITY LOGIC
function getPriority(dueDate) {
    if (!dueDate) return "Low"; // agar date na ho

    let today = new Date();
    let taskDate = new Date(dueDate);

    let diff = (taskDate - today) / (1000 * 60 * 60 * 24);

    if (diff <= 1) return "High";
    else if (diff <= 3) return "Medium";
    else return "Low";
}

// LOAD TASKS ON PAGE LOAD
renderTasks();

