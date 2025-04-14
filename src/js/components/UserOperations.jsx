import { useState, useEffect } from 'react';
import Modal from './Modal';

const UserOperations = ({ username }) => {
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lable, setLabel] = useState(0);

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
      
      if (method == "POST" || method == "DELETE") {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setResponse({ error: error.message });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApiCall('GET', `/users/JulianOrtega`);
    setLabel(3);
  }, []);

  return (
    <div>
      <div className="d-grid gap-3">
        <button
          className="btn btn-primary"
          onClick={() => { handleApiCall('POST', `/users/${username}`); setLabel(1) } }
          disabled={!username || loading}
        >
          {loading ? 'Processing...' : 'Create User'}
        </button>
        
        <button
          className="btn btn-danger"
          onClick={() => { handleApiCall('DELETE', `/users/${username}`); setLabel(2) }}
          disabled={!username || loading}
        >
          {loading ? 'Processing...' : 'Delete User'}
        </button>
        
        <button
          className="btn btn-info"
          onClick={() => { handleApiCall('GET', `/users/${username}`); setLabel(3) }}
          disabled={!username || loading}
        >
          {loading ? 'Processing...' : 'Read User'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={() => { handleApiCall('GET', '/users'); setLabel(4) }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Read All Users'}
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

export default UserOperations;