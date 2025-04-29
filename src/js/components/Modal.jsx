const Modal = ({ content, lable = 0, onClose }) => {
  console.log(content);
  
  // Función para renderizar el contenido adecuadamente
  const renderContent = () => {
    
    if (!content) return <p>No data available</p>;
    
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{content.name ? 'User Created' : content.error ? "To-Do Can't Create" : 'To-Do Updated'}</h5>
          <p className="card-text">
            <strong>{content.name ? 'UserName:' : content.error ? content.error : 'To-Do Name:'}</strong>
          </p>
        </div>
      </div>
    );
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