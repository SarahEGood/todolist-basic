import "./styles.css";
import editImage from "./pencil.svg";
import delImage from "./delete.svg";

document.querySelector('footer').innerHTML += new Date().getFullYear();
var currDate = new Date();
var today = stringifyDate(currDate);

// Load existing tasks
let myTasks = [];
let activeTask = 0;
reloadTasks();

// Load Projects
let myProjects = ['All', 'Inbox'];
reloadProjects();
reloadProjectList();

// Load default click events
var createModal = document.getElementById('modal-create');
var createbtn = document.getElementById("create");
var span = document.getElementById('close-create');
var submitcreate = document.getElementById('submitCreate');
var toggleBtn = document.getElementById('togglebtn');

var editModal = document.getElementById('modal-edit');
var submitedit = document.getElementById('submitEdit');
var editClose = document.getElementById("close_edit");
var deleteBtn = document.getElementById('deleteBtn');
var filterTasks = document.getElementById('filterList');

document.getElementById('c-dateDue').value = new Date().toISOString().split('T')[0];

createbtn.onclick = function() {
    createModal.style.display = 'block';
    document.getElementById('createForm').reset();
}

document.getElementById('createproject').onclick = function() {
    document.getElementById('projectModal').style.display = 'block';
}

document.getElementById('submitProject').onclick = function() {
    createProject();
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

document.getElementById('close-p').onclick = function() {
    document.getElementById('projectModal').style.display = 'none';
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

filterTasks.onclick = function() {
    reloadTasks();
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
    const project = document.getElementById('c-project').value;
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
        <div class="task formatheader">
            <div class="tasklabels">Task</div>
            <div class="tasklabels">Description</div>
            <div class="tasklabels">Due Date</div>
            <div class="tasklabels">Priority</div>
            <div class="tasklabels">Status</div>
            <div class="tasklabels">Edit</div>
        </div>`;
    if (typeof(localStorage.getItem('tasks')) === null) {
        localStorage.setItem('tasks', JSON.stringify(myTasks));
    }
    myTasks = JSON.parse(localStorage.getItem('tasks'));

    const filterme = document.getElementById('filterList').value;
    console.log(filterme);
    if (filterme !== 'all' || filterme !== 'complete') {
        let newTasks = [];

        let limit = Date.parse(today);
        if (filterme === 'tomorrow') {
            limit = addDays(currDate, 1);
        } else if (filterme === 'sevendays') {
            limit = addDays(currDate, 7);
        }

        for (let i = 0; i<myTasks.length; i++) {
            let duedate = Date.parse(myTasks[i].dateDue);
            console.log(duedate);
            console.log(limit);
            if (duedate <= limit) {
                newTasks.push(myTasks[i]);
            }
        }
        myTasks = newTasks;
    }

    let newTasks = [];

    for (let i = 0; i<myTasks.length; i++) {
        console.log(myTasks[i]);
        if ((myTasks[i].complete === true && filterme === 'complete') ||
                (myTasks[i].complete === false && filterme !== 'complete')) {
            newTasks.push(myTasks[i]);
        }
    }
    myTasks = newTasks;

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
        console.log(taskInfo);
        const newRow = document.createElement('div');
        newRow.setAttribute('class', 'task');
        const newtitle = document.createElement('p');
        newtitle.innerHTML = taskInfo.title;
        const newdetail = document.createElement('p');
        newdetail.innerHTML = taskInfo.detail;
        const nDueDate = document.createElement('p');
        if (taskInfo.dateDue) {
            nDueDate.innerHTML = taskInfo.dateDue;
        } else {
            nDueDate.innerHTML = "None";
        }

        const newpriority = document.createElement('select');
        const up = document.createElement('option');
        const hp = document.createElement('option');
        const mp = document.createElement('option');
        const lp = document.createElement('option');
        up.setAttribute('value', '1');
        hp.setAttribute('value', '2');
        mp.setAttribute('value', '3');
        lp.setAttribute('value', '4');
        up.innerHTML = 'Undefined';
        hp.innerHTML = 'High';
        mp.innerHTML = 'Medium';
        lp.innerHTML = 'Low';
        newpriority.appendChild(up);
        newpriority.appendChild(hp);
        newpriority.appendChild(mp);
        newpriority.appendChild(lp);
        
        newpriority.value = myTasks[i].priority;

        const nStatusButton = document.createElement('input');
        nStatusButton.setAttribute('type', 'checkbox');
        if (taskInfo.complete === true) {
            nStatusButton.setAttribute('checked', true);
        }
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

        // Click on task to edit inline
        newtitle.onclick = function() {
            editTaskTitle(newtitle, i);
        }

        newdetail.onclick = function() {
            editTaskDescription(newdetail, i);
        }

        nDueDate.onclick = function() {
            editDueDate(nDueDate, i);
        }

        nStatusButton.onclick = function() {
            editStatus(nStatusButton, i);
        }

        newpriority.onclick = function() {
            myTasks[i].priority = newpriority.value;
            localStorage.setItem('tasks', JSON.stringify(myTasks));
            reloadTasks();
        }

        // Write info to div
        newRow.appendChild(newtitle);
        newRow.appendChild(newdetail);
        newRow.appendChild(nDueDate);
        newRow.appendChild(newpriority);
        newRow.appendChild(nStatusButton);
        newRow.appendChild(neditButton);
        taskList.appendChild(newRow);
    }
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

function reloadProjects() {
    const projectList = document.getElementById('projectList');
    if (typeof(localStorage.getItem('projects')) =='undefined') {
        localStorage.setItem('projects', JSON.stringify(myProjects));
    }
    myProjects = JSON.parse(localStorage.getItem('projects'));

    projectList.innerHTML = `
        <div class="project formatheader">
            <div class="tasklabels">Project</div>
            <div class="tasklabels">Edit</div>
            <div class="tasklabels">Delete</div>
        </div>`;


    for (let i = 0; i<myProjects.length; i++) {
        const p = document.createElement('div');
        p.setAttribute('class', 'project');
        const p_name = document.createElement('p');
        p_name.innerHTML = myProjects[i];
        const editp = document.createElement('div');
        editp.setAttribute('class', 'editbtn');
        const nimage = document.createElement('img');
        nimage.src = editImage;
        editp.appendChild(nimage);

        const deletep = document.createElement('div');
        deletep.setAttribute('class', 'editbtn');
        const pimage = document.createElement('img');
        pimage.src = delImage;
        deletep.appendChild(pimage);

        editp.onclick = function() {
            const p_field = document.createElement('input');
            p_field.setAttribute('for', 'new_title');
            p_field.setAttribute('id', 'new_title');
            p_field.value = myProjects[i];
            p_name.replaceWith(p_field);

            editp.onclick = function() {
                editProject(p_name, p_field);
            }

            p_field.onkeyup = function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    editProject(p_name, p_field);
                }
            }
        }

        deletep.onclick = function () {
            deleteProject(i);
        }

        p.appendChild(p_name);
        p.appendChild(editp);
        p.appendChild(deletep);

        projectList.appendChild(p);
    }
}

function editTaskTitle (newtitle, i) {
    const editTitle = document.createElement('input');
    editTitle.setAttribute('for', 'edit_task');
    editTitle.setAttribute('id', 'edit_task');
    editTitle.value = myTasks[i].title;
    newtitle.replaceWith(editTitle);

    editTitle.onkeyup = function(e) {
        if (e.key === 'Enter') {
            editTaskTitleSubmit(editTitle.value, i);
        }
    }

    window.onclick = function (e) {
        if (e.target.contains(editTitle) && e.target !== editTitle) {
            editTaskTitleSubmit(editTitle.value, i);
        }
    }
}

function editTaskTitleSubmit(newtitle, ind) {
    myTasks[ind].title = newtitle;
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    reloadTasks();
}

function editTaskDescription(newdesc, i) {
    const editD = document.createElement('input');
    editD.setAttribute('for', 'edit-desc');
    editD.setAttribute('id', 'edit-desc');
    editD.value = myTasks[i].detail;
    newdesc.replaceWith(editD);

    editD.onkeyup = function(e) {
        if (e.key === 'Enter') {
            editTaskDescriptionSubmit(editD.value, i);
        }
    }

    window.onclick = function (e) {
        if (e.target.contains(editD) && e.target !== editD) {
            editTaskDescriptionSubmit(editD.value, i);
        }        
    }
}

function editTaskDescriptionSubmit(newDesc, ind) {
    myTasks[ind].detail = newDesc;
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    reloadTasks();   
}

function editDueDate(nDueDate, i) {
    const editDueDate = document.createElement('input');
    editDueDate.setAttribute('type','date');
    editDueDate.setAttribute('for','edit_date');
    editDueDate.setAttribute('id','edit_date');
    editDueDate.value = myTasks[i].dateDue;
    nDueDate.replaceWith(editDueDate);

    editDueDate.onkeyup = function(e) {
        if (e.key === 'Enter') {
            editDueDateSubmit(editDueDate.value, i);
        }
    }

    window.onclick = function (e) {
        if (e.target.contains(editDueDate) && e.target !== editDueDate) {
            editDueDateSubmit(editDueDate.value, i);
        }
    }
}

function editDueDateSubmit(newduedate, ind) {
    console.log(newduedate);
    console.log(newduedate.type);
    myTasks[ind].dateDue = newduedate;
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    reloadTasks();
}

function editStatus(nStatusButton, ind) {
    if (nStatusButton.checked == true) {
        myTasks[ind].complete = true;
    } else {
        myTasks[ind].complete = false;
    }
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    reloadTasks();
}

// Reloads projects in filter list
function reloadProjectList() {
    const dropdown = document.getElementById('filterProject');
    const cDropdown = document.getElementById('c-project');
    const eDropdown = document.getElementById('e-project');
    dropdown.innerHTML = '';
    for (let i=0; i<myProjects.length; i++) {
        const p = document.createElement('option');
        const q = document.createElement('option');
        const r = document.createElement('option');
        p.innerHTML = myProjects[i];
        q.innerHTML = myProjects[i];
        r.innerHTML = myProjects[i];

        p.addEventListener('click', function() {
            reloadTasks(myProjects[i]);
        })

        dropdown.appendChild(p);
        if (myProjects[i] !== 'All') {
            cDropdown.appendChild(q);
            eDropdown.appendChild(r);
        }
    }
}


// Functions to switch views between tasks and projects (and vica versa)
function taskToProject() {
    const t = document.getElementById('tasks');
    const p = document.getElementById('projectList');
    t.style.display = 'none';
    p.style.display = 'grid';
}

function projectToTask() {
    const t = document.getElementById('tasks');
    const p = document.getElementById('projectList');
    t.style.display = 'block';
    p.style.display = 'none';
}

function createProject() {
    myProjects.push(document.getElementById('project_name').value);
    document.getElementById('project_name').value = '';
    document.getElementById('projectModal').style.display = 'none';
    localStorage.setItem('projects', JSON.stringify(myProjects));
    reloadProjectList();
    reloadProjects();
}

function editProject(p_name, p_field) {
    if (p_field.value.length > 0) {
        const i = myProjects.indexOf(p_name.innerHTML);
        myProjects[i] = p_field.value;
    }
    localStorage.setItem('projects', JSON.stringify(myProjects));
    reloadProjectList();
    reloadProjects();
}

function deleteProject(ind) {
    let t = myProjects[ind];
    myProjects = myProjects.filter(item => item !== t)
    localStorage.setItem('projects', JSON.stringify(myProjects));
    reloadProjectList();
    reloadProjects();
}

function stringifyDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = d.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

function addDays(d, days) {
    const newDate = new Date(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
}