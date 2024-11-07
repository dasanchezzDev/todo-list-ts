import { Todo } from './types';

export class TodoList {
  private todos: Todo[] = [];
  private todoList: HTMLUListElement;
  private todoInput: HTMLInputElement;
  private todoForm: HTMLFormElement;

  constructor() {
    this.todoList = document.getElementById('todo-list') as HTMLUListElement;
    this.todoInput = document.getElementById('todo-input') as HTMLInputElement;
    this.todoForm = document.getElementById('todo-form') as HTMLFormElement;
    this.loadTodos();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });
  }

  private loadTodos(): void {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
      this.renderTodos();
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private addTodo(): void {
    const todoText = this.todoInput.value.trim();
    if (todoText) {
      const newTodo: Todo = {
        id: Date.now(),
        text: todoText,
        completed: false
      };
      this.todos.push(newTodo);
      this.saveTodos();
      this.renderTodos();
      this.todoInput.value = '';
    }
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    this.renderTodos();
  }

  private toggleTodo(id: number): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos();
    this.renderTodos();
  }

  private renderTodos(): void {
    this.todoList.innerHTML = '';
    this.todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      const todoText = document.createElement('span');
      todoText.className = 'todo-text';
      todoText.textContent = todo.text;

      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
      completeBtn.onclick = () => this.toggleTodo(todo.id);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => this.deleteTodo(todo.id);

      li.appendChild(todoText);
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      this.todoList.appendChild(li);
    });
  }
}