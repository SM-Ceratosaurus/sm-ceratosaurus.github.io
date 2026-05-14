  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const tagInput = document.getElementById("tagInput");
  const errorDiv = document.getElementById("error");

  const taskList = document.getElementById("taskList");
  const counter = document.getElementById("counter");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const tagFilter = document.getElementById("tagFilter");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let currentFilter = "all";
  let currentTag = "all";

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
      const statusMatch =
        currentFilter === "all" ||
        (currentFilter === "active" && !task.done) ||
        (currentFilter === "completed" && task.done);

      const tagMatch =
        currentTag === "all" ||
        task.tag === currentTag;

      return statusMatch && tagMatch;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement("li");

      const taskInfo = document.createElement("div");
      taskInfo.className = "task-info";

      const taskText = document.createElement("span");
      taskText.textContent = task.text;

      if (task.done) {
        taskText.classList.add("completed");
      }

      taskInfo.appendChild(taskText);

      if (task.tag) {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag";
        tagSpan.textContent = task.tag;
        taskInfo.appendChild(tagSpan);
      }

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = task.done ? "Undo" : "Complete";

      toggleBtn.addEventListener("click", () => {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.background = "#dc3545";

      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      });

      actions.appendChild(toggleBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(taskInfo);
      li.appendChild(actions);

      taskList.appendChild(li);
    });

    updateCounter();
  }

  function updateCounter() {
    const activeCount = tasks.filter(task => !task.done).length;

    counter.textContent =
      `${activeCount} active task${activeCount !== 1 ? "s" : ""}`;
  }

  taskForm.addEventListener("submit", e => {
    e.preventDefault();

    const text = taskInput.value.trim();
    const tag = tagInput.value;

    if (!text) {
      errorDiv.textContent = "Task name cannot be blank.";
      return;
    }

    errorDiv.textContent = "";

    const newTask = {
      id: Date.now(),
      text,
      tag,
      done: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    tagInput.value = "";
  });

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      currentFilter = button.dataset.filter;

      renderTasks();
    });
  });

  tagFilter.addEventListener("change", e => {
    currentTag = e.target.value;
    renderTasks();
  });

  renderTasks();