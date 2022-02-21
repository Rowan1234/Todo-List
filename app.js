const listOfTodos = document.querySelector(`ul.todo-list`);
const form = document.querySelector(`form`);
const newItemInput = form.querySelector(`input.new-todo`);
const timeInput = form.querySelector(`input[type="datetime-local"]`);
const clearTodosButton = document.querySelector(`button.clear-completed`);
const messageBox = document.querySelector(`h3`);
const editButton = document.querySelector(`input.edit-button`);

class TodoList{

	constructor() {
		this.todos = [];
		this.nextId = 0;
		this.isEditing = false;
	}

	addTodo(description, dueDate, priorty) {
		const newTodo = new Todo(description, this.nextId);
		this.todos.push(newTodo);
		let priColor = (priorty === `Do it now`) ? `#FF0000` : (priorty === `Few days left`) ? `#FFFF00` : `#00FF00`;
		listOfTodos.insertAdjacentHTML(`afterbegin`, `
		<li data-id="${this.nextId}">
			<div style="display:flex" class="view">
				<input class="toggle" type="checkbox">
				<label>${dueDate}</label>
				<label>Priorty: <span style="color:${priColor}">${priorty}<span> </label> 
				<button class="destroy"></button>
			</div>
		</li>`);
		let checkbox = listOfTodos.querySelector(`[data-id="${this.nextId}"]>div>input`);
		if (this.isEditing === true) {
			checkbox.insertAdjacentHTML(`afterend`, `
			<label style="display:none" class="desc">${description}</label>
			<input class="desc-edit edit-input" value="${description}"></input>
			`);
		} else {
			checkbox.insertAdjacentHTML(`afterend`, `
			<label class="desc">${description}</label>
			<input style="display:none" class="desc-edit edit-input" value="${description}"></input>
			`);
		}
		
		this.nextId++;
	}

	deleteTodo(htmlRep, id) {
		let todo = this.todos.find(rep => { return rep.id === id });
		console.log(`removed old item called: ${todo.description}`, todo.id);
		let i = this.todos.indexOf(todo);
		this.todos.splice(i, 1);
		htmlRep.remove();
	}

	markAsComplete(todo) {
		todo.completed = true;
		let htmlRep = listOfTodos.querySelector(`[data-id="${todo.id}"]`);
		htmlRep.classList.toggle(`completed`);
	}

	markAsIncomplete(todo) {
		todo.completed = false;
		let htmlRep = listOfTodos.querySelector(`[data-id="${todo.id}"]`);
		htmlRep.classList.toggle(`completed`);
	}

	clearCompleted() {
		let todosFinished = [];
		for (const todo of this.todos) {
			if (todo.completed) {
				todosFinished.push(todo);
			}
		}
		for (const todo of todosFinished) {
			let htmlRep = listOfTodos.querySelector(`[data-id="${todo.id}"]`);
			this.deleteTodo(htmlRep,todo.id);
		}
	}

	editTodo() {
		if (this.isEditing === false) {
			this.isEditing = true;
			let listOTodos = listOfTodos.children;
			for (const todo of listOTodos) {
				let desc = todo.querySelector(`label.desc`);
				let descEdit = todo.querySelector(`input.desc-edit`);
				descEdit.value = desc.innerHTML;
				desc.style.display = `none`;
				descEdit.style.display = `inline`;
			}
		} else {
			this.isEditing = false;
			let listOTodos = listOfTodos.children;
			for (const todo of listOTodos) {
				let desc = todo.querySelector(`label.desc`);
				let descEdit = todo.querySelector(`input.desc-edit`);
				desc.innerHTML = descEdit.value;
				desc.style.display = `block`;
				descEdit.style.display = `none`;
			}
		}
	}
}

class Todo {
	constructor(description, id, dueDate) {
		this.description = description;
		this.dueDate = dueDate;
		this.priorty = 0; //date - due date = time
		this.completed = false;
		this.id = id;
	}
}

const todoList = new TodoList();
timeInput.value = moment().format(`YYYY-MM-DDThh:mm`);

form.addEventListener(`submit`, event => {
	event.preventDefault();
	messageBox.innerText = ``;
	messageBox.style.padding = ``;
	if (newItemInput.value !== ``) {
		let today = moment().format(`YYYY-MM-DDThh:mm`);
		let tomorrow = moment(today).add(1, `days`);
		if (timeInput.value > tomorrow.format(`YYYY-MM-DDThh:mm`)) {
			let descData = newItemInput.value;
			newItemInput.value = ``;
			console.log(`added new item called: ${descData}`);
			let weekFromNow = moment(today).add(7, `days`);
			let aCoupleDays = moment(today).add(2, `days`);
			let priorty = `...`;
			if (timeInput.value > weekFromNow.format(`YYYY-MM-DDThh:mm`)) {
				priorty = `You've got time`;
			} else if (timeInput.value > aCoupleDays.format(`YYYY-MM-DDThh:mm`)) {
				priorty = `Few days left`;
			} else {
				priorty = `Do it now`;
			}

			todoList.addTodo(descData, (moment(timeInput.value).format(`YYYY-MM-DD`) + " " + moment(timeInput.value).format(`hh:mm a`)), priorty);
		} else {
			messageBox.innerText = `Date must be atleast 1 day from now.`;
			messageBox.style.padding = `20px 10px`;
		}
	} else {
		messageBox.innerText = `Can't have an empty description`;
		messageBox.style.padding = `20px 10px`;
	}
});

listOfTodos.addEventListener(`click`, event => {
	if (event.target.nodeName === `INPUT`) {
		if (todoList.isEditing === false) {
			let id = parseInt(event.target.parentNode.parentNode.dataset.id);
			let todo = todoList.todos.find(rep => { return rep.id === id });
			if (todo.completed === false) {
				todoList.markAsComplete(todo);
			} else {
				todoList.markAsIncomplete(todo);
			}
		}
	} else if (event.target.nodeName === `BUTTON`) {
		let htmlRep = event.target.parentNode.parentNode;
		let id = parseInt(htmlRep.dataset.id);
		todoList.deleteTodo(htmlRep, id);
	}
});

clearTodosButton.addEventListener(`click`, () => todoList.clearCompleted());

editButton.addEventListener(`click`, () => todoList.editTodo());