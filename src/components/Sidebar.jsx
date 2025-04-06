import { useSharedNotebook } from '../context/SharedNotebookContext';

function Sidebar() {
  const { darkMode, toggleDarkMode } = useSharedNotebook();

  return (
    <div className="sidebar">
      {/* ... existing sidebar content ... */}
      
      <div className="sidebar-footer">
        <button 
          onClick={toggleDarkMode}
          className="dark-mode-toggle"
        >
          {darkMode ? '☀️ Açık Mod' : '🌙 Karanlık Mod'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar; 