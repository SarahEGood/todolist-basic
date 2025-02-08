import "./styles.css";

// Load existing tasks
let myTasks = [];
reloadTasks();

var createModal = document.getElementById('modal-create');
var createbtn = document.getElementById("create");
var span = document.getElementsByClassName("close")[0];
var submitcreate = document.getElementById('submitCreate');

document.getElementById('c-dateDue').value = new Date().toISOString().split('T')[0];;

createbtn.onclick = function() {
    createModal.style.display = 'block';
}

submitcreate.onclick = function() {
    createTask();
    createModal.style.display = 'none';
}

span.onclick = function() {
    createModal.style.display = 'none';
}

// Task Objects
class Task {
    constructor(title, detail, dateDue, priority, project, parent, children) {
        this.title = title;
        this.detail = detail;
        this.dateDue = dateDue;
        this.priority = priority;
        this.project = project;
        this.parent = parent;
        this.children = children;
        this.createdDate = new Date();
        this.modDate = new Date();
    }

    get getJson() {
        let jsonob = {
            title: this.title,
            detail: this.detail,
            dueDate: this.dateDue,
            priority: this.priority,
            project: this.project,
            parent: this.parent,
            children: this.children,
            createdDate: this.createdDate,
            modDate: this.modDate   
        };
        return jsonob;
    }

}

// Task CRUD functionality
function createTask() {
    // Get task info from a form in a create task modal
    // Optional: May need to create new func or pass param if also allow inline on page

    const title = document.getElementById('c-title').value;
    const detail = document.getElementById('c-detail').value;
    const duedate = document.getElementById('c-dateDue').value;
    const priority = document.getElementById('c-priority').value;
    let project = document.getElementById('c-project').value;
    if (project == null) {
        project = 'Inbox';
    }

    let newTask = new Task(title, detail, duedate, priority, project,
        0, 0
    );

    // Then, append to data and save
    myTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(myTasks));

    // Then, reload tasks
    reloadTasks();

    // Also, close modal

}

function editTask() {
    // Same as above, but from an edit modal

    // overwrite task by task id

    //reload page
}

function deleteTask() {
    // Trigger on delete button on task list or edit modal
    // optional: ask user if ok to delete
    // Delete from data and reload list
}

// Display tasks
function reloadTasks() {
    // Clear task list div
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    myTasks = JSON.parse(localStorage.getItem('tasks'));

    // If no json for tasks, create one
    // else, load the existing json
    for (let i=0; i<myTasks.length; i++) {
        let taskInfo = myTasks[i];
        const newRow = document.createElement('div');
        newRow.innerHTML = taskInfo.title + ' ' + taskInfo.detail;
        taskList.appendChild(newRow);
        // Note: display other info too
    }

    // iterate through json of tasks to display them on modal
}
