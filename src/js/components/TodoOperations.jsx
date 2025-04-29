import { useState, useEffect } from 'react';
import Modal from './Modal';

const TodoOperations = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  const API_BASE = 'https://playground.4geeks.com/todo';
  const USERNAME = 'JulianOrtega';

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Verificar si el usuario ya existe
        const userCheck = await fetch(`${API_BASE}/users/${USERNAME}`);
        if (userCheck.status === 404) {
          await fetch(`${API_BASE}/users/${USERNAME}`, { method: 'POST' });
        }
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'API request failed');
      }
      
      // Actualizar lista después de operaciones
      const updated = await fetch(`${API_BASE}/users/${USERNAME}`);
      setTodos((await updated.json()).todos);
      
    } catch (error) {
      setResponse({ error: error.message });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      const isDuplicate = todos.some(todo => todo.label === newTodo.trim());
      if (isDuplicate) {
        setResponse({ error: 'La tarea ya existe' });
        setShowModal(true);
        return;
      }
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

  const deleteAllTodos = async () => {
    setLoading(true);
    try {
      const todosToDelete = [...todos];
      for (const todo of todosToDelete) {
        await fetch(`${API_BASE}/todos/${todo.id}`, { method: 'DELETE' });
      }
      setTodos([]);
    } catch (error) {
      setResponse({ error: error.message });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.label);
  };

  const submitEdit = async () => {
    if (!editText.trim()) {
      setResponse({ error: 'La tarea no puede estar vacía' });
      setShowModal(true);
      return;
    }
    
    const isDuplicate = todos.some(todo => 
      todo.id !== editingTodo.id && todo.label === editText.trim()
    );
    
    if (isDuplicate) {
      setResponse({ error: 'La tarea ya existe' });
      setShowModal(true);
      return;
    }

    try {
      await handleApiCall('PUT', `/todos/${editingTodo.id}`, {
        ...editingTodo,
        label: editText.trim()
      });
      setEditingTodo(null);
    } catch (error) {
      // El error ya se maneja en handleApiCall
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List</h1>
      
      <input
        type="text"
        className="form-control"
        placeholder="Añadir tarea"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={addTodo}
        disabled={loading}
      />

      <div className="mt-2 text-muted">
        {todos.length === 0 
          ? "No hay tareas" 
          : `${todos.length} ${todos.length === 1 ? 'tarea' : 'tareas'}`}
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
            
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => handleEdit(todo)}
                style={{
                  opacity: hoverIndex === index ? 1 : 0,
                  transition: "opacity 0.3s ease"
                }}
              >
                Editar
              </button>
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
            </div>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button 
          className="btn btn-danger mt-3"
          onClick={deleteAllTodos}
          disabled={loading}
        >
          Eliminar todas las tareas
        </button>
      )}

      {showModal && (
        <Modal
          content={response}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingTodo && (
        <div className="modal-backdrop" onClick={() => setEditingTodo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Editar tarea</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setEditingTodo(null)}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={submitEdit}
                disabled={!editText.trim()}
              >
                Guardar
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setEditingTodo(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          min-width: 400px;
        }
        .list-group-item:hover .btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default TodoOperations;