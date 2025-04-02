import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserOperations from './UserOperations';
import TodoOperations from './TodoOperations';

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [username, setUsername] = useState('');

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do List API Interface</h1>
      
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Operations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            Todo Operations
          </button>
        </li>
      </ul>
      
      {activeTab === 'users' ? (
        <UserOperations username={username} />
      ) : (
        <TodoOperations username={username} />
      )}
    </div>
  );
}

export default App;