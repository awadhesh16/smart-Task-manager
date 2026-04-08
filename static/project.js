// 🔥 Add Task
function addTask() {
    let name = document.getElementById("taskInput").value;
    let priority = document.getElementById("priority").value;

    if (name.trim() === "") return;

    fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            priority: priority
        })
    })
    .then(res => res.json())
    .then(() => {
        loadTasks();

        // ✅ Clear input
        document.getElementById("taskInput").value = "";
    })
    .catch(err => console.log("Add Error:", err));
}


// 🔥 Load & Display Tasks
function loadTasks() {
    fetch('/get')
    .then(res => res.json())
    .then(data => {

        console.log("DATA:", data);

        // ✅ Priority Order
        const priorityOrder = {
            "High": 1,
            "Medium": 2,
            "Low": 3
        };

        // ✅ Sort tasks
        data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        let list = document.getElementById("taskList");

        if (!list) {
            console.log("taskList not found!");
            return;
        }

        list.innerHTML = "";

        data.forEach(task => {
            let li = document.createElement("li");

            // 🎨 Priority color class
            li.className = task.priority.toLowerCase();

            let span = document.createElement("span");
            span.textContent = `${task.name} (${task.priority})`;

            let btn = document.createElement("button");
            btn.textContent = "Delete";

            btn.onclick = function () {
                deleteTask(task.id);
            };

            li.appendChild(span);
            li.appendChild(btn);

            list.appendChild(li);
        });
    })
    .catch(err => console.log("Load Error:", err));
}


// 🔥 Delete Task
function deleteTask(id) {
    fetch(`/delete/${id}`, {
        method: 'DELETE'
    })
    .then(() => loadTasks())
    .catch(err => console.log("Delete Error:", err));
}


// 🚀 Run when page loads
window.onload = loadTasks;