import { useState, useEffect } from 'react';
import Modal from './Modal';

const TodoOperations = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const API_BASE = 'https://playground.4geeks.com/todo';
  const USERNAME = 'JulianOrtega';

  // Crear usuario automáticamente y cargar tareas
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Crear usuario
        await fetch(`${API_BASE}/users/${USERNAME}`, { method: 'POST' });
        // Cargar tareas
        const res = await fetch(`${API_BASE}/users/${USERNAME}`);
        const data = await res.json();
        setTodos(data.todos);
      } catch (error) {
        setResponse({ error: 'Error inicializando usuario' });
        setShowModal(true);
      }
    };
    initializeUser();
  }, []);

  const handleApiCall = async (method, endpoint, body = null) => {
    setLoading(true);
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
      };

      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await res.json();
      
      // Actualizar lista después de operaciones
      if (method !== 'GET') {
        const updated = await fetch(`${API_BASE}/users/${USERNAME}`);
        setTodos((await updated.json()).todos);
      }

      setResponse(data);
      setShowModal(true);
    } catch (error) {
      setResponse({ error: error.message });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      handleApiCall('POST', `/todos/${USERNAME}`, {
        label: newTodo.trim(),
        is_done: false
      });
      setNewTodo('');
    }
  };

  const toggleTodo = (todo) => {
    handleApiCall('PUT', `/todos/${todo.id}`, {
      ...todo,
      is_done: !todo.is_done
    });
  };

  const deleteTodo = (todoId) => {
    handleApiCall('DELETE', `/todos/${todoId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List</h1>
      
      <input
        type="text"
        className="form-control"
        placeholder="Add a task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={addTodo}
        disabled={loading}
      />

      <div className="mt-2 text-muted">
        {todos.length === 0 
          ? "No tasks" 
          : `${todos.length} ${todos.length === 1 ? 'task' : 'tasks'}`}
      </div>

      <ul className="list-group mt-3">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={todo.is_done}
                onChange={() => toggleTodo(todo)}
                id={`todo-${todo.id}`}
              />
              <label className="form-check-label" htmlFor={`todo-${todo.id}`}>
                {todo.label}
              </label>
            </div>
            
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTodo(todo.id)}
              style={{
                opacity: hoverIndex === index ? 1 : 0,
                transition: "opacity 0.3s ease"
              }}
            >
              &#10006;
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <Modal
          content={response}
          onClose={() => setShowModal(false)}
        />
      )}

      <style>{`
        .list-group-item:hover .btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default TodoOperations;