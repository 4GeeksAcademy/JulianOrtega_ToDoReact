import { useState } from 'react';
import Modal from './Modal';

const TodoOperations = ({ username }) => {
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todoId, setTodoId] = useState('');
  const [todoData, setTodoData] = useState({
    label: '',
    is_done: false
  });
  const [lable, setLable] = useState(0);

  const handleApiCall = async (method, endpoint, body = null) => {
    setLoading(true);
    try {
      const options = {
        method,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      
      if (body) options.body = JSON.stringify(body);
      
      const res = await fetch(`https://playground.4geeks.com/todo${endpoint}`, options);
      const data = await res.json();
      setResponse(data);
      setShowModal(true);
    } catch (error) {
      setResponse({ error: error.message });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="todoId" className="form-label">Todo ID (for PUT/DELETE):</label>
        <input
          type="text"
          className="form-control"
          id="todoId"
          value={todoId}
          onChange={(e) => setTodoId(e.target.value)}
          placeholder="Enter todo ID"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="todoLabel" className="form-label">Todo Label:</label>
        <input
          type="text"
          className="form-control"
          id="todoLabel"
          value={todoData.label}
          onChange={(e) => setTodoData({...todoData, label: e.target.value})}
          placeholder="Enter todo label"
        />
      </div>
      
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="todoDone"
          checked={todoData.is_done}
          onChange={(e) => setTodoData({...todoData, is_done: e.target.checked})}
        />
        <label className="form-check-label" htmlFor="todoDone">
          Is Done?
        </label>
      </div>
      
      <div className="d-grid gap-3">
        <button
          className="btn btn-primary"
          onClick={() => {handleApiCall('POST', `/todos/${username}`, todoData); setLable(5)}}
          disabled={!username || !todoData.label || loading}
        >
          {loading ? 'Processing...' : 'Create Todo'}
        </button>
        
        <button
          className="btn btn-warning"
          onClick={() => {handleApiCall('PUT', `/todos/${todoId}`, todoData); setLable(6)}}
          disabled={!todoId || loading}
        >
          {loading ? 'Processing...' : 'Update Todo'}
        </button>
        
        <button
          className="btn btn-danger"
          onClick={() => {handleApiCall('DELETE', `/todos/${todoId}`); setLable(7)}}
          disabled={!todoId || loading}
        >
          {loading ? 'Processing...' : 'Delete Todo'}
        </button>
      </div>
      
      {showModal && (
        <Modal 
          content={response}
          lable = {lable}
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default TodoOperations;