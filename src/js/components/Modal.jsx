const Modal = ({ content, lable = 0, onClose }) => {
  console.log(content, lable);
  
  // Función para renderizar el contenido adecuadamente
  const renderContent = () => {
    
    if (!content) return <p>No data available</p>;
    
    // Crear usuario o tarea, actualizar Tarea
    if (lable == 1 || lable == 5 || lable == 6 || lable == 7 && !content.detail) {
      return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{content.name ? 'User Created' : content.error ? 'To-Do Deleted' : 'To-Do Updated'}</h5>
            <p className="card-text">
              <strong>{content.name ? 'UserName:' : content.error ? '' : 'To-Do Name:'}</strong> {content.name ? content.name : content.label}
            </p>
          </div>
        </div>
      );
    }

    // Si es Borrar usuario
    if(lable == 2 && !content.detail){
      return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">User Deleted</h5>
          </div>
        </div>
      );
    }

    // Si es una lista de todos
    if (lable == 3 && !content.detail) {
      return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {content.todos.map(todo => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.label}</td>
                <td>
                  {todo.is_done ? (
                    <span className="badge bg-success">Done</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Si es una lista de usuarios
    if (lable == 4 && !content.detail) {
      console.log(content.users);
      
      return (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {content.users.map((user) => (
              <tr key={user.id}>
                <td>{typeof user === 'string' ? user : user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Si es un mensaje de éxito/error
    if (content.detail) {
      return (
        <div className={`alert ${content.detail ? 'alert-danger' : 'alert-success'}`}>
          {content.detail}
        </div>
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">API Response</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;