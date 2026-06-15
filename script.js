const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox"
                       ${task.completed ? "checked" : ""}
                       data-id="${task.id}"
                       class="toggle">

                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>

            <div class="actions">
                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

taskList.addEventListener("click", function(e) {

    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    if (e.target.classList.contains("edit-btn")) {

        const newText = prompt("Edit Task:");

        if (newText && newText.trim() !== "") {

            const task = tasks.find(task => task.id === id);

            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

taskList.addEventListener("change", function(e) {

    if (e.target.classList.contains("toggle")) {

        const id = Number(e.target.dataset.id);

        const task = tasks.find(task => task.id === id);

        task.completed = e.target.checked;

        saveTasks();
        renderTasks();
    }
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

renderTasks();