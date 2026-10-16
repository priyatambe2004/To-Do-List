/* ---------- State: tasks live in a plain JavaScript array (in memory only) ---------- */
let tasks = [];          // each task: { id, text, done }
let nextId = 1;          // gives every task a unique id
let filter = "all";      // "all" | "active" | "done"
let lastAddedId = null;  // used for the slide-in animation
let lastRemoved = null;  // remembers the last deleted task for Undo
let toastTimer;

const $ = (id) => document.getElementById(id);
const form = $("task-form"), input = $("task-input"), errorEl = $("error");
const listEl = $("task-list"), emptyEl = $("empty");

/* ---------- Actions that change the array ---------- */
function addTask(text) {
  tasks.push({ id: nextId++, text, done: false });
  lastAddedId = tasks[tasks.length - 1].id;
}

function removeTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return;
  lastRemoved = { task: tasks[index], index };
  tasks = tasks.filter((task) => task.id !== id); // filter() builds a new array without that task
}

function toggleTask(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
}

/* ---------- Rendering: redraw the whole list from the array ---------- */
function getVisibleTasks() {
  if (filter === "active") return tasks.filter((task) => !task.done);
  if (filter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

function render() {
  listEl.innerHTML = "";

  getVisibleTasks().forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "") + (task.id === lastAddedId ? " new" : "");
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "task-" + task.id;
    checkbox.checked = task.done;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = task.text; // textContent is safe: it never runs typed HTML

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.dataset.action = "delete";
    del.setAttribute("aria-label", "Delete task: " + task.text);
    del.textContent = "🗑";

    li.append(checkbox, label, del);
    listEl.appendChild(li);
  });
  lastAddedId = null;

  // Empty message
  if (getVisibleTasks().length === 0) {
    if (tasks.length === 0) emptyEl.textContent = "No tasks yet. Add your first task above. ✨";
    else if (filter === "active") emptyEl.textContent = "Nothing left to do. Great job! 🎉";
    else emptyEl.textContent = "No completed tasks yet.";
  } else emptyEl.textContent = "";

  // Stats and progress
  const done = tasks.filter((task) => task.done).length;
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  $("count-total").textContent = tasks.length;
  $("count-active").textContent = tasks.length - done;
  $("count-done").textContent = done;
  $("progress-bar").style.width = percent + "%";
  document.querySelector(".progress").setAttribute("aria-valuenow", percent);
  $("clear-done").hidden = done === 0;
}

/* ---------- Adding a task (with validation) ---------- */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim().replace(/\s+/g, " ");

  if (text === "") return showError("Please type a task first.");
  if (tasks.some((task) => task.text.toLowerCase() === text.toLowerCase())) {
    return showError("That task is already on your list.");
  }

  clearError();
  addTask(text);
  input.value = "";
  if (filter === "done") setFilter("all"); // so the new task is visible
  render();
  input.focus();
});

function showError(message) {
  errorEl.textContent = message;
  input.classList.add("invalid");
  input.focus();
}
function clearError() {
  errorEl.textContent = "";
  input.classList.remove("invalid");
}
input.addEventListener("input", clearError);

/* ---------- EVENT DELEGATION ----------
   Instead of adding a listener to every delete button, we add ONE listener to the
   parent list. Clicks "bubble up" from the button to the list, and we use
   event.target.closest() to find out which button was clicked. This also works
   for tasks that are added later, because the list itself never changes. */
listEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='delete']");
  if (!button) return;

  const id = Number(button.closest(".task").dataset.id);
  removeTask(id);
  render();
  showToast("Task deleted.");
});

// Same idea for the checkboxes: one "change" listener on the list
listEl.addEventListener("change", (event) => {
  if (!event.target.matches("input[type='checkbox']")) return;
  toggleTask(Number(event.target.closest(".task").dataset.id));
  render();
});

/* ---------- Filters and clear completed ---------- */
function setFilter(name) {
  filter = name;
  document.querySelectorAll(".filter").forEach((btn) => {
    const active = btn.dataset.filter === name;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

$("filters").addEventListener("click", (event) => {
  const btn = event.target.closest(".filter");
  if (!btn) return;
  setFilter(btn.dataset.filter);
  render();
});

$("clear-done").addEventListener("click", () => {
  clearCompleted();
  render();
});

/* ---------- Undo delete ---------- */
function showToast(message) {
  $("toast-text").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}
function hideToast() {
  $("toast").hidden = true;
  lastRemoved = null;
}

$("undo").addEventListener("click", () => {
  if (!lastRemoved) return;
  tasks.splice(lastRemoved.index, 0, lastRemoved.task); // put it back in its old position
  lastRemoved = null;
  hideToast();
  render();
});

/* ---------- Start ---------- */
setFilter("all");
render();
