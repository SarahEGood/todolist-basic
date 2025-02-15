import * as index from './index.js';
import * as dateutils from "./dateutils.js";

export function outputTaskLabels() {
    const labels = `
        <div class="task formatheader">
            <div class="tasklabels">Task</div>
            <div class="tasklabels">Description</div>
            <div class="tasklabels">Due Date</div>
            <div class="tasklabels">Priority</div>
            <div class="tasklabels">Status</div>
            <div class="tasklabels">Edit</div>
        </div>`;
    return labels;
}

export function filterByDate(myTasks, filterme, today) {
    if (filterme !== 'all' || filterme !== 'complete') {
        let newTasks = [];
        let currDate = new Date();

        let limit = Date.parse(today);
        if (filterme === 'tomorrow') {
            limit = dateutils.addDays(currDate, 1);
        } else if (filterme === 'sevendays') {
            limit = dateutils.addDays(currDate, 7);
        }

        for (let i = 0; i<myTasks.length; i++) {
            let duedate = Date.parse(myTasks[i].dateDue);
            console.log(duedate);
            console.log(limit);
            if (duedate <= limit) {
                newTasks.push(myTasks[i]);
            }
        }
        return newTasks;
    } else {
        return myTasks;
    }
}

export function filterByCompletion(myTasks, filterme) {
    let newTasks = [];

    for (let i = 0; i<myTasks.length; i++) {
        console.log(myTasks[i]);
        if ((myTasks[i].complete === true && filterme === 'complete') ||
                (myTasks[i].complete === false && filterme !== 'complete')) {
            newTasks.push(myTasks[i]);
        }
    }
    return newTasks;
}

export function filterByProject(myTasks, project) {
    if (project!=='All') {
        let newTasks = [];
        for (let i = 0; i<myTasks.length; i++) {
            let t = myTasks[i].project;
            if (t === project) {
                newTasks.push(myTasks[i]);
            }
        }
        return newTasks;
    } else {
        return myTasks;
    }
}

export function generateTaskElements(myTasks, taskList, editImage) {
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
            editTaskTitle(myTasks, newtitle, i);
        }

        newdetail.onclick = function() {
            editTaskDescription(myTasks, newdetail, i);
        }

        nDueDate.onclick = function() {
            editDueDate(myTasks, nDueDate, i);
        }

        nStatusButton.onclick = function() {
            editStatus(myTasks, nStatusButton, i);
        }

        newpriority.onclick = function() {
            myTasks[i].priority = newpriority.value;
            localStorage.setItem('tasks', JSON.stringify(myTasks));
            index.reloadTasks();
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
    index.reloadTasks();
}

function editTaskDescription(myTasks, newdesc, i) {
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
            editTaskDescriptionSubmit(myTasks, editD.value, i);
        }        
    }
}

function editTaskDescriptionSubmit(myTasks, newDesc, ind) {
    myTasks[ind].detail = newDesc;
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    index.reloadTasks();   
}

function editDueDate(myTasks, nDueDate, i) {
    const editDueDate = document.createElement('input');
    editDueDate.setAttribute('type','date');
    editDueDate.setAttribute('for','edit_date');
    editDueDate.setAttribute('id','edit_date');
    editDueDate.value = myTasks[i].dateDue;
    nDueDate.replaceWith(editDueDate);

    editDueDate.onkeyup = function(e) {
        if (e.key === 'Enter') {
            editDueDateSubmit(myTasks, editDueDate.value, i);
        }
    }

    window.onclick = function (e) {
        if (e.target.contains(editDueDate) && e.target !== editDueDate) {
            editDueDateSubmit(myTasks, editDueDate.value, i);
        }
    }
}

function editDueDateSubmit(myTasks, newduedate, ind) {
    console.log(newduedate);
    console.log(newduedate.type);
    myTasks[ind].dateDue = newduedate;
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    index.reloadTasks();
}

function editStatus(myTasks, nStatusButton, ind) {
    if (nStatusButton.checked == true) {
        myTasks[ind].complete = true;
    } else {
        myTasks[ind].complete = false;
    }
    localStorage.setItem('tasks', JSON.stringify(myTasks));
    index.reloadTasks(myTasks);
}