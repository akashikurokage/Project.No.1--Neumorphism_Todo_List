//GLOBAL VARIABLES
const taskInput = document.getElementById("input-task");
const taskAdderBtn = document.querySelector(".add-task-btn");
const errorModalBox = document.querySelector(".error-modal-box");
const errorModalBoxBtn = document.querySelector(".error-message-btn");

const inProgressTasks = document.querySelector(".inprogress-tasks");
const completedTasks = document.querySelector(".completed-tasks");

const inProgressTasksBtn = document.querySelector(".inprogress-btn");
const completedTasksBtn = document.querySelector(".completed-btn");
const themeSwitchBtn = document.querySelector(".theme-switcher");

const showEmptyCompletedTasklist = document.querySelector(".completed-empty-modal-icon");
const showEmptyInProgressTasklist = document.querySelector(".inprogress-empty-modal-icon");

const inProgressTasklist = document.querySelector(".inprogress-tasklist");
const completedTasklist = document.querySelector(".completed-tasklist");



let completedTaskItems = loadCompletedTask(); //Initial empty array for updating a In Progress Tasklist
let inProgressTasksItems = loadInProgressTask(); //Initial empty array for updating a Completed Tasklist




/* Calling the appendToTaskList function to initialized which the marked task append only to Completed Tasklist & completedTaskItems array. 

PARAMETERS: 
taskItems = completedTaskItems,
taskList = completedTasklist.
*/
appendToTaskList(completedTaskItems, completedTasklist); 



/* Calling the appendToTaskList function to initialized which the marked task append only to In Progress Tasklist & inProgressTasksItems array. 

PARAMETERS(Check JS line #73): 
taskItems = inProgressTasksItems,
taskList = inProgressTasklist.
*/
appendToTaskList(inProgressTasksItems, inProgressTasklist); 





// CREATING TASK ELEMENTS
function createTaskElements(task) {
  const newTask = document.createElement("li");

  const taskSpan = document.createElement("span"); //create left span components 
  taskSpan.classList.add("left");
  taskSpan.innerHTML = `<i class="ri-checkbox-blank-circle-line"></i> ${task}`; // Use the passed task

  const deleteSpan = document.createElement("span"); //Create Delete Button
  deleteSpan.classList.add("right");
  deleteSpan.innerHTML = `<i class="ri-delete-bin-6-fill"></i>`;

  newTask.appendChild(taskSpan);
  newTask.appendChild(deleteSpan);
  return newTask;
}






// APPEND TASK ELEMENTS TO A SPECIFIED TASKLIST
function appendToTaskList(taskItems, taskList){
	taskList.innerHTML = ""; //Clears both  entire tasklist(In Progress & Completed Tasklist)

	taskItems.forEach((task) => {
		const taskItem = createTaskElements(task); // Get the created Elements from createTaskElements and Pass the newly created task to createTaskElements
		taskList.appendChild(taskItem); //Appends the task in both Tasklists after creating a new task
	});
}






//ADDING A TASK TO THE INPROGRESS TASKLIST
function addTask() {
  if (taskInput.value === "") {
    errorModalBox.classList.add("show");
  }
  else {
    inProgressTasksItems.push(taskInput.value.trim()); // Add the task to the "inProgressTasksItems" array
    appendToTaskList(inProgressTasksItems, inProgressTasklist); // Calling appendTOTaskList to append new task to IN Progress tasklist
	  saveInProgressTask();
  }
  taskInput.value = "";
}

//ADD TASK BUTTON
taskAdderBtn.addEventListener("click", addTask);


//ADD TASK BY PRESSING "ENTER"
taskInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
		 e.preventDefault();
        addTask();
    }
});





//HIDE THE ERROR MODAL BOX (CHECK JS LINE CODE: 62)
errorModalBoxBtn.addEventListener("click", () => {
	errorModalBox.classList.remove("show");
});





//AUTOMATICALLY CHECKS IF THE INPROGRESS TASKLIST IS EMPTY OR NOT
function checkInprogressEmpty(){
	completedTasks.style.display = "none";
	showEmptyCompletedTasklist.style.display = "none";
	
	if(inProgressTasklist.children.length === 0){
		showEmptyInProgressTasklist.style.display = "block";
		inProgressTasks.style.display = "none";
	}

	else{
		showEmptyInProgressTasklist.style.display = "none";
		inProgressTasks.style.display = "block";
	}
}

inProgressTasksBtn.addEventListener("click", checkInprogressEmpty); //DISPLAY INPROGRESS TASKLIST IF THE INPROGRESS BUTTON IS CLICKED
inProgressTasklist.addEventListener("DOMSubtreeModified", checkInprogressEmpty); //CHECKS THE INPROGRESS TASKLIST CHILDREN 
checkInprogressEmpty(); //INITIAL CALL (DISPLAYS AS DEFAULT SCREEN)






//AUTOMATICALLY CHECKS IF THE COMPLETED TASKLIST IS EMPTY OR NOT
function checkCompletedEmpty(){
	inProgressTasks.style.display = "none";
	showEmptyInProgressTasklist.style.display = "none";
	
	if(completedTasklist.children.length === 0){
		showEmptyCompletedTasklist.style.display = "block";
		completedTasks.style.display = "none";
	}

	else{
		showEmptyCompletedTasklist.style.display = "none";
		completedTasks.style.display = "block";
	}
}

completedTasksBtn.addEventListener("click", checkCompletedEmpty); //DISPLAY COMPLETED TASKLIST IF THE INPROGRESS BUTTON IS CLICKED
completedTasklist.addEventListener("DOMSubtreeModified", checkCompletedEmpty); //CHECKS THE COMPLETED TASKLIST CHILDREN 






// MARK THE TASK AS COMPLETED, AND A DELETE TASK BUTTON FUNCTION
inProgressTasklist.addEventListener("click", (clicked) => {
	if(clicked.target.classList.contains("ri-checkbox-blank-circle-line")){
		const selectTask = clicked.target.closest("li");

		
		if(selectTask){ //Selects the closest "li" element if the user clicks a checkbox icon
			
			//Adds class "checked" to move the task to Completed Tasklist and remove it to In Progress Tasklist
			selectTask.classList.toggle("checked"); 
			clicked.target.classList.remove("ri-checkbox-blank-circle-line");
			clicked.target.classList.add("ri-checkbox-circle-fill");


			// 1. Get the index of the Task to Move
			const taskIndex = Array.from(inProgressTasklist.children).indexOf(selectTask);

			// 2. If the task is found in the In Progress Tasklist,
			 if (taskIndex !== -1) {

	 // 3. Remove the task from "In Progress Tasklist & its array(inProgressTasksItems)" and move it to "Completed Tasklist & its array(completedTaskItems)"
				 const taskToMove = inProgressTasksItems.splice(taskIndex, 1)[0];
       		 completedTaskItems.push(taskToMove);
				 saveCompletedTask();
			 }
			// 4. Now, append the marked task to Completed Tasklist
			completedTasklist.appendChild(selectTask);
			 checkInprogressEmpty();
		}
	}

	else if(clicked.target.classList.contains("ri-delete-bin-6-fill")){
		const selectTask = clicked.target.closest("li");
		
		if (selectTask) {
      // 1. Get the index of the task to delete
      const taskIndex = Array.from(inProgressTasklist.children).indexOf(selectTask);

      // 2. If the task is found in the In Progress tasklist (index is not -1)
      if (taskIndex !== -1) {
        // 3. Remove the task from the inProgressTasksItems array
        inProgressTasksItems.splice(taskIndex, 1); 

        // 4. Now, remove the task from the In Progress Tasklist DOM
        selectTask.remove();
        checkInprogressEmpty(); 
      }
    }
  }
	saveInProgressTask();
});




// MARK THE TASK AS IN-PROGRESS, AND A DELETE TASK BUTTON FUNCTION
completedTasklist.addEventListener("click", (clicked) => {
	if(clicked.target.classList.contains("ri-checkbox-circle-fill")){
		const selectTask = clicked.target.closest("li");

		if(selectTask){ //Selects the closest "li" element if the user clicks a checkbox icon

		//Removes class "checked" to move the task to In Progress Tasklist and remove it to COmpleted Tasklist
			selectTask.classList.remove("checked");
			clicked.target.classList.remove("ri-checkbox-circle-fill");
			clicked.target.classList.add("ri-checkbox-blank-circle-line");

			// 1. Get the index of the Task to Move
			const taskIndex = Array.from(completedTasklist.children).indexOf(selectTask);

				// 2. If the task is found in the In Progress Tasklist,
			 if (taskIndex !== -1) {

	 // 3. Remove the task from "COmpleted Tasklist & its array(completedTaskItems)" and move it to "In Progress Tasklist & its array(inProgressTasklist)"
				 const taskToMove = completedTaskItems.splice(taskIndex, 1)[0];
       		 inProgressTasksItems.push(taskToMove);
				saveInProgressTask();
			 }

			// 4. Now, append the unmarked task to In Progress Tasklist
			inProgressTasklist.appendChild(selectTask);
			checkCompletedEmpty();
		}
	}

	else if(clicked.target.classList.contains("ri-delete-bin-6-fill")){
		const selectTask = clicked.target.closest("li");
		
		if (selectTask) {
      // 1. Get the index of the task to delete
      const taskIndex = Array.from(completedTasklist.children).indexOf(selectTask);

      // 2. If the task is found in the Completed Tasklist (index is not -1)
      if (taskIndex !== -1) {
        // 3. Remove the task from the completedTaskItems array
        completedTaskItems.splice(taskIndex, 1); 

        // 4. Now, remove the task from the Completed Tasklist DOM
        selectTask.remove();
        checkCompletedEmpty(); 
			saveCompletedTask();
      }
    }
  }
	saveCompletedTask();
});





//THEME SWITCH FUNCTION
let darkmode = localStorage.getItem("dark-mode");


//LIGHT MODE FUNCTION
function enableDarkMode(){
	themeSwitchBtn.innerHTML = `<i class="ri-sun-fill"></i>Light Mode`;
	document.body.classList.add("dark-mode");

	localStorage.setItem("dark-mode", "active");
}

//DARK MODE FUNCTION
function disableDarkMode(){
	themeSwitchBtn.innerHTML = `<i class="ri-moon-clear-line"></i>Dark Mode`;
	document.body.classList.remove("dark-mode");

	localStorage.setItem("dark-mode", null);
}


if(darkmode === "active") enableDarkMode();


//THEME SWITCH BUTTON CONDITION
themeSwitchBtn.addEventListener("click", () => {
	darkmode = localStorage.getItem("dark-mode");

	if(darkmode !== "active"){
		enableDarkMode();
	}
	else{
		disableDarkMode();
	}
});





// LOCAL STORAGE FUNCTION

// Saving INPROGRESS Tasklist
function saveInProgressTask(){
	const saveInProgress = JSON.stringify(inProgressTasksItems);

	localStorage.setItem("inProgress", saveInProgress);
}

function loadInProgressTask(){
	const loadInprogress = localStorage.getItem("inProgress") || "[]";

	return JSON.parse(loadInprogress);
}



// Saving COMPLETED Tasklist
function saveCompletedTask(){
	const saveCompleted = JSON.stringify(completedTaskItems);
	localStorage.setItem("completed", saveCompleted);
}

function loadCompletedTask() {
  const loadCompleted = localStorage.getItem("completed") || "[]";
  return JSON.parse(loadCompleted); // Assign the parsed value
}
