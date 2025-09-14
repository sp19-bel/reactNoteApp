import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([{ id: 1, text: "Example note" }]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedId == null) {
      setDraft("");
      return;
    }
    const note = notes.find((n) => n.id === selectedId);
    if (note) setDraft(note.text);
    else setDraft("");
  }, [selectedId, notes]);
  const handleSave = () => {
    const text = draft.trim();
    if (!text) return; //  empty check

    if (selectedId == null) {
      const newNote = { id: Date.now(), text };
      setNotes((prev) => [...prev, newNote]);
    } else {
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedId ? { ...n, text } : n))
      );
    }

   
    setDraft("");
  };
  const handleDelete = () => {
    if (!selectedId) return;
    setNotes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
    setDraft("");
  };
  const getPreview = (text) => {
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>My Notes</h2>
        <ul>
          {notes.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setShowModal(true);
              }}
              className={item.id === selectedId ? "selected" : ""}
            >
              {getPreview(item.text)}
            </li>
          ))}
        </ul>
      </aside>
      
      <main className="editor">
        <h2>Note Editor</h2>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Start writing your note here..."
        />
        <div className="button-group">
          <button className="save-btn" type="button" onClick={handleSave} disabled={!draft.trim()}>
            Save
          </button>
          <button className="delete-btn" type="button" onClick={handleDelete} disabled={!selectedId}>
            Delete
          </button>
        </div>
      </main>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h3>Note Details</h3>
            
            {(() => {
              const selectedNote = notes.find((n) => n.id === selectedId);
              console.log('Modal Debug:', { selectedId, selectedNote, notes });
              
              return selectedNote ? (
                <div>
                  <p><strong>Created:</strong> {new Date(selectedNote.id).toLocaleString()}</p>
                  
                 
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Edit your note here..."
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '1rem',
                      border: '2px solid #e1ecc8',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontFamily: 'Georgia, serif',
                      lineHeight: '1.6',
                      marginTop: '1rem',
                      marginBottom: '1rem'
                    }}
                  />
                  
                
                  <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                    <button 
                      className="save-btn" 
                      onClick={() => {
                        handleSave();
                      
                      }}
                      disabled={!draft.trim()}
                      style={{padding: '0.5rem 1rem'}}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => {
                        handleDelete();
                        setShowModal(false); 
                      }}
                      style={{padding: '0.5rem 1rem'}}
                    >
                      Delete Note
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{color: 'red'}}>Note not found! Selected ID: {selectedId}</p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
