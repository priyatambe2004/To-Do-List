 # Simple To-Do List (In-Memory)

A to-do list app built with **HTML5, CSS3, and JavaScript**.
This project is part of my Web Development Internship at **Veda Technology** (Task 16).

🔗 **Live Demo:** https://priyatambe2004.github.io/To-Do-List/

## 📌 About the Project

Users can add tasks, mark them as done, and delete them. All tasks are stored in a JavaScript array in memory, so there is **no persistence**: the list resets when the page is refreshed. This is intentional, as required by the task.

## 🎯 Objective

To practice array manipulation, DOM rendering, and event delegation.

## ✨ Features

- Input field to add tasks (press Enter or click "Add task")
- List rendered from a JavaScript array
- Delete button for every task
- Mark tasks as done with a checkbox
- Filters: All, To do, and Done
- "Clear completed" button
- Undo for the last deleted task
- Counters for total, to do, and done tasks, with a progress bar
- Validation for empty and duplicate tasks
- Safe rendering with `textContent`, so typed HTML cannot run as code
- Friendly empty-state messages
- Responsive layout and keyboard-friendly controls

## 🧠 How It Works

**1. State lives in an array**

```js
let tasks = [];   // each task: { id, text, done }
```

**2. Every change updates the array, then the list is re-rendered**

```js
tasks = tasks.filter((task) => task.id !== id); // remove a task
render();                                       // redraw the list from the array
```

**3. Event delegation**

Instead of adding a click listener to every delete button, one listener on the parent list handles all of them. Clicks bubble up from the button, and `event.target.closest()` finds which task was clicked. This works for tasks added later too.

```js
listEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='delete']");
  if (!button) return;
  // find the task id and remove it
});
```

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, custom checkboxes, animations)
- JavaScript (arrays, DOM, event delegation)

## 📚 What I Learned

- Storing app state in an array
- Removing items with `filter()` and restoring them with `splice()`
- Rendering a list from data and re-rendering after every change
- Why event delegation uses less memory and works for new items
- Why re-rendering from one source of truth avoids bugs
- Using `textContent` instead of `innerHTML` for safe output
- Validating user input

## 📁 Project Structure

```
todo-list/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run

1. Download or clone this repository:
   ```
   git clone https://github.com/your-username/To-Do-list.git
   ```
2. Open the folder.
3. Double-click `index.html` to open it in your browser.

## 👩‍💻 Author

**Priya Vijay Tambe**
