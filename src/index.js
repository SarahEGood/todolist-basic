import "./styles.css";
import editImage from "./pencil.svg";

document.querySelector('footer').innerHTML += new Date().getFullYear();

// Load existing tasks
let myTasks = [];
let activeTask = 0;
reloadTasks();

// Load Projects
let myProjects = ['All', 'Inbox'];
reloadProjectList();

var createModal = document.getElementById('modal-create');
var createbtn = document.getElementById("create");
var span = document.getElementsByClassName("close")[0];
var submitcreate = document.getElementById('submitCreate');
var toggleBtn = document.getElementById('togglebtn');

var editModal = document.getElementById('modal-edit');
var submitedit = document.getElementById('submitEdit');
var editClose = document.getElementById("close_edit");
var deleteBtn = document.getElementById('deleteBtn');

document.getElementById('c-dateDue').value = new Date().toISOString().split('T')[0];

createbtn.onclick = function() {
    createModal.style.display = 'block';
    document.getElementById('createForm').reset();
}

submitcreate.onclick = function() {
    createTask();
    createModal.style.display = 'none';
}

submitedit.onclick = function() {
    //Add logic for overwriting task
    editTask();
    editModal.style.display = 'none';
}

span.onclick = function() {
    createModal.style.display = 'none';
}

editClose.onclick = function() {
    editModal.style.display = 'none';
}

deleteBtn.onclick = function() {
    deleteTask(activeTask);
    editModal.style.display = 'none';
    reloadTasks();
}

toggleBtn.onclick = function() {
    if (toggleBtn.innerHTML === 'Projects') {
        taskToProject();
        toggleBtn.innerHTML = 'Tasks';
    } else {
        projectToTask();
        toggleBtn.innerHTML = 'Projects';
    }
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
        this.complete = false;
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
}

function editTask() {
    const title = document.getElementById('e-title').value;
    const detail = document.getElementById('e-detail').value;
    const duedate = document.getElementById('e-dateDue').value;
    const priority = document.getElementById('e-priority').value;
    let project = document.getElementById('e-project').value;
    if (project == null) {
        project = 'Inbox';
    }

    let newTask = new Task(title, detail, duedate, priority, project,
        0, 0
    );

    // Then, append to data and save
    myTasks[activeTask] = newTask;
    localStorage.setItem('tasks', JSON.stringify(myTasks));

    // Then, reload tasks
    reloadTasks();

}

// Delete Task
function deleteTask(ind) {
    console.log(myTasks.length);
    let t = myTasks[ind];
    myTasks = myTasks.filter(item => item !== t)
    console.log(myTasks.length);
    localStorage.setItem('tasks', JSON.stringify(myTasks));
}

// Display tasks
function reloadTasks(project='All') {
    // Clear task list div
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = `
        <div class="task">
            <div class="tasklabels">Task</div>
            <div class="tasklabels">Description</div>
            <div class="tasklabels">Due Date</div>
            <div class="tasklabels">Status</div>
            <div class="tasklabels">Edit</div>
        </div>`;

    myTasks = JSON.parse(localStorage.getItem('tasks'));

    if (project!=='All') {
        let newTasks = [];
        for (let i = 0; i<myTasks.length; i++) {
            let t = myTasks[i].project;
            if (t === project) {
                newTasks.push(myTasks[i]);
            }
        }
        myTasks = newTasks;
    }

    // If no json for tasks, create one
    // else, load the existing json
    for (let i=0; i<myTasks.length; i++) {
        let taskInfo = myTasks[i];
        const newRow = document.createElement('div');
        newRow.setAttribute('class', 'task');
        const newtitle = document.createElement('p');
        newtitle.innerHTML = taskInfo.title;
        const newdetail = document.createElement('p');
        newdetail.innerHTML = taskInfo.detail;
        const nDueDate = document.createElement('p');
        nDueDate.innerHTML = taskInfo.dateDue;
        const nStatusButton = document.createElement('input');
        nStatusButton.setAttribute('type', 'checkbox');
        const neditButton = document.createElement('div');
        neditButton.setAttribute('class', 'editbtn');
        const nimage = document.createElement('img');
        nimage.src = editImage;
        neditButton.appendChild(nimage);

        // Add logic to pop out edit modal
        neditButton.onclick = function () {
            editModal.style.display = 'block';
            populateEdit(i);
            console.log(activeTask);
        }

        // Write info to div
        newRow.appendChild(newtitle);
        newRow.appendChild(newdetail);
        newRow.appendChild(nDueDate);
        newRow.appendChild(nStatusButton);
        newRow.appendChild(neditButton);
        taskList.appendChild(newRow);
    }

    // iterate through json of tasks to display them on modal
}

// Populate Edit fields with corresponding task
function populateEdit(ind) {
    const task = myTasks[ind];
    
    document.getElementById('e-title').value = task.title;
    document.getElementById('e-detail').value = task.detail;
    document.getElementById('e-dateDue').value = task.dateDue;
    document.getElementById('e-priority').value = task.priority;
    document.getElementById('e-project').value = task.project;

    activeTask = ind;
}

// Reloads projects in filter list
function reloadProjectList() {
    const dropdown = document.getElementById('filterProject');
    for (let i=0; i<myProjects.length; i++) {
        const p = document.createElement('option');
        p.innerHTML = myProjects[i];

        p.addEventListener('click', function() {
            reloadTasks(myProjects[i]);
        })

        dropdown.appendChild(p);


    }
}


// Functions to switch views between tasks and projects (and vica versa)
function taskToProject() {
    const t = document.getElementById('tasks');
    const p = document.getElementById('projectList');
    t.style.display = 'none';
    p.style.display = 'block';
}

function projectToTask() {
    const t = document.getElementById('tasks');
    const p = document.getElementById('projectList');
    t.style.display = 'block';
    p.style.display = 'none';
}
