import "./styles.css";

// ToDo List Objects
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

}