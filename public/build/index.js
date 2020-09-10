"use strict";
import tippy from "tippy.js";
import "tippy.js/animations/scale.css";

window.addEventListener("load", () => {
  if (localStorage.getItem("todos"))
    renderTodos(JSON.parse(localStorage.getItem("todos")));
  else renderTodos(TODO_LIST);
});

//Grab DOM elements
const todoInputEl = document.querySelector(".todo-input");
const addTodoBtnEl = document.querySelector(".add-todo");
const todoContentEl = document.querySelector(".todo-box");
const alertToastEl = document.querySelector(".alert-toast");
const danielTooltipSpan = document.querySelector("#daniel-tooltip");

tippy(danielTooltipSpan, {
  content: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  theme: "tomato",
  allowHTML: true,
  arrow: true,
  animation: "scale",
});

// Global Variables
let TODO_LIST = [];
let todo;
const parsedTodos = JSON.parse(localStorage.getItem("todos"));

function ID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

todoInputEl.addEventListener("input", (e) => {
  todo = e.target.value;
});

function onSubmit(e) {
  e.preventDefault();
  if (!todo) return (alertToastEl.style.visibility = "visible");

  let todoObj = {
    id: ID(),
    text: todo,
    date: new Date().toLocaleDateString("he-IL"),
    done: false,
  };
  if (parsedTodos) {
    parsedTodos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(parsedTodos));
    renderTodos(parsedTodos);
  } else {
    TODO_LIST.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(TODO_LIST));
    renderTodos(TODO_LIST);
  }
  todo = "";
  todoInputEl.value = "";
}

document.getElementsByTagName("form")[0].addEventListener("submit", onSubmit);

addTodoBtnEl.addEventListener("click", onSubmit);

window.deleteTodo = (todoId) => {
  let filteredTodo = parsedTodos.findIndex((todo) => {
    return todo.id === todoId;
  });
  parsedTodos.splice(filteredTodo, 1);
  localStorage.setItem("todos", JSON.stringify(parsedTodos));
  renderTodos(parsedTodos);
};

window.doneTodo = (todoId) => {
  let todo = parsedTodos.find((todo) => todo.id === todoId);
  if (!todo.done) todo.done = true;
  else todo.done = false;
  localStorage.setItem("todos", JSON.stringify(parsedTodos));
  renderTodos(parsedTodos);
};

function renderTodos(todos) {
  if (Object.keys(todos).length === 0) {
    todoContentEl.innerHTML = `<div class='flex justify-center h-full  items-center'>It does not matter how slowly you go as long as you do not stop. </div>`
  } else {
    todoContentEl.innerHTML = todos
      .map(
        (todo) =>
          `<div class=" flex justify-between w-full bg-teal-100 hover:bg-green-100 hover:shadow-md shadow-sm pl-1 pr-1 mb-3">
        <div class="mb-3 mt-2 todo-text flex ${
          todo.done ? "line-through" : ""
        }"> <div class="mr-2">${todo.date} - </div>${todo.text}</div>
        <div class="bg-yellow-300 w-12 h-6 flex self-center justify-around shadow-sm">
        
          <button id='delete-todo' onclick="deleteTodo('${
            todo.id
          }')" class="flex justify-center self-center delete-todo">
          
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
        
          </button>

          <button onclick="doneTodo('${todo.id}')">
       
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 24 24"
            >
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
          
          </button>
        </div>
      </div>
      `
      )
      .join("");
  }
}
