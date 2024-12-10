
const buttonForQuotes = document.querySelector('#quote-button')

buttonForQuotes.addEventListener('click', fetchQuote)

function fetchQuote(){
 
 // const url = `https://quoteslate.vercel.app/api/quotes/random?tags=life,wisdom,motivation`
 //  const url = `https://dummyjson.com/quotes/random/1`
 //  const url = `https://type.fit/api/quotes`
 const url = `https://api.realinspire.tech/v1/quotes/random`
 fetch(url)
.then(res => res.json()) 
.then(data => { 
 
 
 console.log(data)
 console.log(data[0].content)
 console.log(data[0].author)
 
 document.querySelector('.quote-text').innerHTML = data[0].content;
 document.querySelector('.quote-author').innerHTML = data[0].author;



}) 

.catch(err => { 
   console.log(`error ${err}`) 
});

}

var editFeedbackBtn = document.getElementsByClassName("edit-btn");
var deleteTaskBtn = document.getElementsByClassName("delete-btn");

Array.from(editFeedbackBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const taskId = this.dataset.id;
    const currentFeedback = this.dataset.feedback;
    
    const newFeedback = prompt('Enter new feedback', currentFeedback);

    fetch('/tasks/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        feedback: newFeedback.toLocaleLowerCase()
      })
    })
    .then(response => response.json())
    .then(data => window.location.reload());
  });
});
Array.from(deleteTaskBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const taskId = this.dataset.id;
    fetch('/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: taskId })
    }).then(response => window.location.reload());
  });
});

var editDailyBtn = document.getElementsByClassName("edit-btn-daily");
var deleteTaskDailyBtn = document.getElementsByClassName("delete-btn-daily");
// console.log('Console delete btn var', deleteTaskDailyBtn)



Array.from(editDailyBtn).forEach(function(element) {
  console.log('now in the edit arr')
  element.addEventListener('click', function(){
    const dailytaskId = this.dataset.id;
    const currentDailyTask = this.dataset.currentDailyTask;
    
    const newcurrentDailyTask = prompt('Enter feedback', currentDailyTask);
    

    fetch('/tasksDaily/currentDailyTask', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: dailytaskId,
        title: newcurrentDailyTask
      })
    })
    .then(response => response.json())
    .then(data => window.location.reload());
  });
});

Array.from(deleteTaskDailyBtn).forEach(function(element) {
  console.log ('console log in the delete daily')
  element.addEventListener('click', function(){
    const dailytaskId = this.dataset.id;
    fetch('/tasksDaily', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ id: dailytaskId })
    }).then(response => window.location.reload());
  });
});


// habits
//targeting the form
const addHabits = document.querySelector(".add-habit");
//to dynamically update the li with a checkbox, progress text, and delete btn
const habitsList = document.querySelector(".habits");
const habits = JSON.parse(localStorage.getItem("habits")) || [];

//this func: reads input fields. | gets the text, reps, and time frame values from the form inputs
function addHabit(e) {
  //prevent the refresh when a habit is added//using for console log too
  e.preventDefault();
  const text = this.querySelector("[name=habit]").value;//
  //The + is a efficient way to convert strings to numbers.
  //The user enters 5 into the # of Repetitions input field. -> The input's .value is "5" (a string). -> The + converts "5" into 5 (a number). -> totalCounts is assigned the value 5.
  const totalCounts = +this.querySelector("[name=reps]").value;
  const timeframe = this.querySelector("[name=timeframe]").value;
  //this object creates new text, reps, totalcounts, timeframe, and the completed
  //this func adds new habits to the habits array, saves updated habit array to localstorage
  const habit = {
    text: text,
    //starts at 0
    reps: 0,
    totalCounts: totalCounts,
    timeframe: timeframe,
    completed: false,
  };

  habits.push(habit);
  //calls listHabits to render the updated li in the ul .habits
  listHabits(habits, habitsList);
  //local storage is an api that allows data in the habists li to persist between reloeds and broser sessions
  //it uses 'key: value' pairs | json converts the js object into a json string bcs local storage only stores strings
  //important for page reload, even if the user closes and reloads the browser the data persits
  localStorage.setItem("habits", JSON.stringify(habits)); 
  //clears all input fields using the this.reset()
  //this refers to the form element becs the element (form) triggered the event listener (submit)
  this.reset();
  console.log(habit);
}

//this func updates the ul .habits | renders each li with a checkbox, a labbels showing progress, frequency, and habit text, also a delete btn
//the inner html is dynamically replaced with the generated li 
function listHabits(habit = [], habitsList) {
  habitsList.innerHTML = habits
  //itarating over each item in the habits array and creating a new array where each element is the result of the callback function. rhis is creating an array of strings for each habit
  //params: habit and i for the current objs and the index of the current habit
    .map((habit, i) => {
      //returning a string of html //interprated as html (the string)
      //the checkbox : data-index{i} : syores the index of the current habit in the habits array, used to identify which habti is toggled
      //id=habits{i} : unique id for hte checkbox based on the index
      //${habist=completed}: if habit.completed is true, the checked attribute is added to the checkbox, makitg it appear selected
      //the label: dispays the hbabit details, not the checkbox | habits{i} connects the label to the corresponding checkbox by its id
      //<span>${habit.reps}/${habit.totalCounts} ${habit.timeframe}</span>: displays the habits progress and its timeframe
      //${habit.text}: The habit's name, entered by the user.
      //data-index=${i}: Stores the index of the habit in the habits array, allowing the delete function to identify which habit to remove.
      return `
            <li>
            <input type="checkbox" data-index=${i} id="habit${i}" ${
        habit.completed ? "checked" : ""
      } />
            <label for="habit${i}"><span>${habit.reps}/${habit.totalCounts} ${
        habit.timeframe
      }</span> ${habit.text}</label>
        <button class="delete" data-index=${i} id="delete${i}">Delete</button>
        </li>
        `;
    })
    .join("");
}

// Toggle If Complete
//
function toggleCompleted(e) {
  //checking if clicked elemnet is an input element (like the checkbox)
  //the click element can be triggered by other elements(like the buttons)
  //the .matches method checks if the element matches the specified css selector (input)
  if (!e.target.matches("input")) return;
  //el is the clicked checkbox element | array
  const el = e.target;
  // datset retrievs the data-index attribute form the checkbox. this is the habits position in the habtis  array
  const index = el.dataset.index;
  //increments the reps val for the habit at the specified index
  //tracks the progress of the habit (how many repetitions have been completed)
  habits[index].reps += 1;

  //if the reps value equals the required totalcounts for the habit, it makrs the habit as completed
  if (habits[index].reps === habits[index].totalCounts) {
    habits[index].completed = true;
    //if the user clicks the checbox too many times and reps exceeds totalconuts, it resests the reps to 0
    //makrs the habit as incomplete. prevents reps to exceed the goal
  } else if (habits[index].reps > habits[index].totalCounts) {
    habits[index].reps = 0;
    habits[index].completed = false;
  }

  //re-renders the habit li with the updated progress in the dom
  listHabits(habits, habitsList);
  //saves it to the localsotrage, updates it in the local storage, persits when the p[age loads
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Delete Habit
//removes the corresponding habit from the habits array | saves the updated state of the habits array to the localsotrage
function deleteHabit(e) {
  //cheks if the clicked element is the delete btn | might be triggered by other elements(like the ckecbox aor labels) | if the click is not a button, the function stops if it's not the btn
  if (!e.target.matches("button")) return;
  //el is the delete btn | el.dataset.index: Retrieves the data-index attribute from the button. This value corresponds to the habit’s position in the habits array. 
  const el = e.target;
  const index = el.dataset.index;

  //removes the habit at the habits array by the specified index | 1 is the number of hbabits to be deleted
  habits.splice(index, 1);

  //calls the listHabits func to rerender the list of habits in the DOM | makes sure the UI reflects he updated habits array afte deletion
  listHabits(habits, habitsList);
  //updates the localsotrage with the new habits array, makign sure the habit is no longer saved
  localStorage.setItem("habits", JSON.stringify(habits));
}
//triggers the function
addHabits.addEventListener("submit", addHabit);
//triggers the func toggleCompleted)
habitsList.addEventListener("click", toggleCompleted);
//tirggered when the user clicks delete
habitsList.addEventListener("click", deleteHabit);

listHabits(habits, habitsList);