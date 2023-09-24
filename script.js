class List {
    constructor(name, color){
        this.name = name;
        this.color = color;
    }
}

class Task {
    constructor(name, description, list, date){
        this.id = Math.round(Date.now() * Math.random());
        this.name = name;
        this.description = description;
        this.list = list;
        this.date = date;
        this.checked = false
    }

    updateTask(name, description, list, date){
        this.name = name;
        this.description = description;
        this.list = list;
        this.date = date;
    }
}

let lists = [];
let tasks = [];
currentTaskID = 0;
asideMode = null;

document.addEventListener("readystatechange", (e) => {
    if(e.target.readyState === "complete"){
        init();
    }
})

function setAsideMode(mode){
    taskTitle = document.querySelector("#taskTitle");
    taskName = document.querySelector("#taskName");
    taskDescription = document.querySelector("#taskDescription");
    taskList = document.querySelector("#taskList");
    taskDate = document.querySelector("#taskDate");
    taskColor = document.querySelector("#taskColor");
    taskCancelButton = document.querySelector("#taskCancelButton");
    taskConfirmButton = document.querySelector("#taskConfirmButton");
    labels = document.querySelectorAll("label");
    taskColorLabel = document.getElementById("taskColorLabel");

    taskName.value = "";
    taskDescription.value = "";
    taskList.value = "";
    taskDate.value = "";
    taskColor.value = "000000";
    taskConfirmButton.innerHTML = "Save Task"

    if(mode === "newTask"){
        asideMode = "newTask";

        taskTitle.style.display = "block";
        taskName.style.display = "block";
        taskDescription.style.display = "block";
        taskList.style.display = "block";
        taskDate.style.display = "block";
        taskCancelButton.style.display = "block";
        taskConfirmButton.style.display = "block";
        for(let label of labels){
            label.style.display = "block";
        }

        taskColor.style.display = "none";
        taskColorLabel.style.display = "none";

        populateAsideLists();
        taskTitle.innerHTML = "New Task";
    }
    else if(mode === "newList"){
        asideMode = "newList";

        taskTitle.style.display = "block";
        taskName.style.display = "block";
        taskColor.style.display = "block";
        taskColorLabel.style.display = "block";
        taskCancelButton.style.display = "block";
        taskConfirmButton.style.display = "block";

        taskTitle.innerHTML = "New List";
        taskConfirmButton.innerHTML = "Save List"

    }
    else if(mode === "editTask"){
        asideMode = "editTask";

        taskTitle.style.display = "block";
        taskName.style.display = "block";
        taskDescription.style.display = "block";
        taskList.style.display = "block";
        taskDate.style.display = "block";
        taskCancelButton.style.display = "block";
        taskConfirmButton.style.display = "block";
        for(let label of labels){
            label.style.display = "block";
        }
        taskColor.style.display = "none";
        taskColorLabel.style.display = "none";
        

        populateAsideLists();
        taskTitle.innerHTML = "Task";
    }
    else if(mode === "editList"){
        asideMode = "editList";

    }
    else {
        asideMode = null;
        taskTitle.style.display = "none";
        taskName.style.display = "none";
        taskDescription.style.display = "none";
        taskList.style.display = "none";
        taskDate.style.display = "none";
        taskCancelButton.style.display = "none";
        taskConfirmButton.style.display = "none";
        taskColor.style.display = "none";
        for(let label of labels){
            label.style.display = "none";
        }
        taskColor.style.display = "none";
        taskColorLabel.style.display = "none";
    }
}

function saveButton() {
    taskName = document.querySelector("#taskName").value;
    taskDescription = document.querySelector("#taskDescription").value;
    taskList = document.querySelector("#taskList").value;
    taskDate = document.querySelector("#taskDate").value;
    taskColor = document.querySelector("#taskColor").value;

    if(asideMode === "newTask"){
        tasks.push(new Task(taskName, taskDescription, lists.find((list) => list.name === taskList), taskDate));
        displayTasks(getEveryTaskID());
        displayLists();
        updateMenuTasks();
        saveTasks();
    }
    else if(asideMode === "newList"){
        console.log(taskName, taskColor);
        lists.push(new List(taskName, taskColor));
        displayLists();
        saveLists();
    }

    else if(asideMode === "editTask"){
        currTask = tasks.find((task) => task.id === currentTaskID);
        currTask.updateTask(taskName, taskDescription, lists.find((list) => list.name === taskList), taskDate);
        displayTasks(getEveryTaskID());
        displayLists();
        updateMenuTasks();
        saveTasks();
    }
    else if(asideMode === "editList"){

    }
    else {

    }
    setAsideMode(null);
}

function populateAsideLists(){
    taskList = document.querySelector("#taskList");
    taskList.innerHTML = "";
    for (let list of lists){
        let option = document.createElement("option");
        option.setAttribute("value", list.name);
        option.innerHTML = list.name;
        taskList.appendChild(option);
    }
}

function getUpcomingTasksID(){
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    t = tasks.filter((task) => {
        const diffTime = Math.abs(Date(task.date.replace("-", "/")) - Date(utc.replace("-", "/")));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
    });
    return [t.map((task) => task.id), "Upcoming"];
}

function getTodayTasksID(){
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    t = tasks.filter((task) => task.date === utc);
    return [t.map((task) => task.id), "Today"];
}

function getEveryTaskID(){
    return [tasks.map((task) => task.id), "Everything"];
}

function getListTaskID(list){
    t = tasks.filter((task) => task.list.name === list);
    return [t.map((task) => task.id), list.charAt(0).toUpperCase() + list.slice(1)];
}


function updateMenuTasks(){
    upcomingTaskCount = document.querySelector("#upcomingTaskCount");
    todayTaskCount = document.querySelector("#todayTaskCount");
    everythingTaskCount = document.querySelector("#everythingTaskCount");

    upcomingTaskCount.innerHTML = getUpcomingTasksID()[0].length;
    todayTaskCount.innerHTML = getTodayTasksID()[0].length;
    everythingTaskCount.innerHTML = getEveryTaskID()[0].length;
}

function makeListDOM(_list, count){
    /* Create list */
    // <div class="task_group">
    //     <div class="task_group--left">
    //         <div class="task_group__list" style="background-color: gold;"></div>
    //         <span class="task_group__title">Personal</span>
    //     </div>
    //     <div class="task_group__count">5</div>
    // </div>
    let taskGroup = document.createElement("div"); 
    taskGroup.classList.add("task_group");
    taskGroup.addEventListener("click", () => {
        displayTasks(getListTaskID(_list.name))
    });
    let taskGroup_left = document.createElement("div");
    taskGroup_left.classList.add("task_group--left");
    let taskGroupList = document.createElement("div");
    taskGroupList.classList.add("task_group__list");
    let taskGroupTitle = document.createElement("span");
    taskGroupTitle.classList.add("task_group__title");
    let taskGroupCount = document.createElement("div");
    taskGroupCount.classList.add("task_group__count");

    taskGroupList.setAttribute("style", `background-color: ${_list.color};`);
    taskGroupTitle.innerHTML = _list.name;
    taskGroupCount.innerHTML = count;

    taskGroup_left.appendChild(taskGroupList);
    taskGroup_left.appendChild(taskGroupTitle);
    taskGroup.appendChild(taskGroup_left);
    taskGroup.appendChild(taskGroupCount);

    return taskGroup;
}

function makeTaskDOM(_task){
    /*<div class="task">
        <div class="task__main">
            <div>
                <input type="checkbox" class="task__checkbox">
                <span>Solve your daily LeetCode problem</span>
            </div>
            <img src="images/arrow-right.svg" alt="Arrow pointing right" class="task__more_info">
        </div>
        <div class="task__additional">
            <div class="task__additional__block">
                <img src="images/calendar-x.svg" alt="Calendar icon" class="task_group__icon">
                <span>20-9-2023</span>
            </div>
            <div class="task__additional__block">
                <div class="task_group__list" style="background-color: gold;"></div>
                <span>Personal</span>
            </div>
        </div>
    </div>*/
    currentTaskID = _task.id;
    task = document.createElement("div");
    task.setAttribute("id", `${_task.id}`);
    task.classList.add("task");

    taskMain = document.createElement("div");
    taskMain.classList.add("task__main");

    emptyDiv = document.createElement("div");

    taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.classList.add("task__checkbox");
    taskCheckbox.addEventListener("change", () => {finishTask(_task.id);});

    taskText = document.createElement("span");

    taskMore = document.createElement("img");
    taskMore.setAttribute("src", "images/arrow-right.svg");
    taskMore.addEventListener("click", () => {
        setAsideMode("editTask");
        displayTaskInfo(_task.id);
    })
    taskMore.classList.add("task__more_info");

    taskAdditional = document.createElement("div");
    taskAdditional.classList.add("task__additional");

    taskAdditionalBlock1 = document.createElement("div");
    taskAdditionalBlock1.classList.add("task__additional__block");
    taskAdditionalBlock1Img = document.createElement("img");
    taskAdditionalBlock1Img.setAttribute("src", "images/calendar-x.svg");
    taskAdditionalBlock1Img.classList.add("task_group__icon")
    taskAdditionalBlock1Span = document.createElement("span");

    taskAdditionalBlock2 = document.createElement("div");
    taskAdditionalBlock2.classList.add("task__additional__block");
    taskAdditionalBlock2List = document.createElement("div");
    taskAdditionalBlock2List.classList.add("task_group__list");
    taskAdditionalBlock2Span = document.createElement("span");

    emptyDiv.appendChild(taskCheckbox);
    taskText.innerHTML = _task.name;
    emptyDiv.appendChild(taskText);

    taskMain.appendChild(emptyDiv);
    taskMain.appendChild(taskMore);

    task.appendChild(taskMain);

    taskAdditionalBlock1.appendChild(taskAdditionalBlock1Img);
    taskAdditionalBlock1Span.innerHTML = _task.date;
    taskAdditionalBlock1.appendChild(taskAdditionalBlock1Span);
    taskAdditional.appendChild(taskAdditionalBlock1);

    taskAdditionalBlock2List.setAttribute("style", `background-color: ${_task.list.color};`);
    taskAdditionalBlock2.appendChild(taskAdditionalBlock2List);
    taskAdditionalBlock2Span.innerHTML = _task.list.name;
    taskAdditionalBlock2.appendChild(taskAdditionalBlock2Span);
    taskAdditional.appendChild(taskAdditionalBlock2);

    task.appendChild(taskAdditional);
    return task;
}

function displayLists(){
    if(lists.length === 0){
        return;
    }
    listMenu = document.querySelector("#listMenu");
    listMenu.innerHTML = "";
    for(let list of lists){
        listMenu.insertBefore(makeListDOM(list, tasks.filter((task) => task.list === list).length), listMenu.childNodes[listMenu.children.length]);
    }
}

function displayTasks(idArray){
    if(tasks.length === 0){
        return;
    }
    taskMenu = document.querySelector("#taskMenu");
    taskGroupTitle = document.querySelector("#taskGroupTitle");
    taskGroupCount = document.querySelector("#taskGroupCount");
    taskGroupTitle.innerHTML = idArray[1];
    taskGroupCount.innerHTML = idArray[0].length;
    taskMenu.innerHTML = "";
    for(let task of tasks){
        if (idArray[0].includes(task.id)){
            taskMenu.appendChild(makeTaskDOM(task));
        }
    }
    updateMenuTasks();
}

function finishTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    taskDOM = document.getElementById(id);
    taskDOM.remove();
    displayLists();
    updateMenuTasks();
    saveTasks();
}

function displayTaskInfo(id){
    task = tasks.find((task) => task.id === id);

    taskName = document.querySelector("#taskName");
    taskDescription = document.querySelector("#taskDescription");
    taskList = document.querySelector("#taskList");
    taskDate = document.querySelector("#taskDate");

    taskName.value = task.name;
    taskDescription.value = task.description;
    taskList.value = task.list.name.toLowerCase();
    taskDate.value = task.date;
}

function saveLists(){
    localStorage.setItem("lists", JSON.stringify(lists));
}

function loadLists(){
    if(localStorage.getItem("lists") === null){
        return;
    }
    lists = JSON.parse(localStorage.getItem("lists"));
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    if(localStorage.getItem("tasks") === null){
        return;
    }
    tasks = JSON.parse(localStorage.getItem("tasks"));
    updateMenuTasks();
}

function init() {
    loadLists();
    loadTasks();

    setAsideMode(0);
    displayLists();
    displayTasks(getEveryTaskID());
}