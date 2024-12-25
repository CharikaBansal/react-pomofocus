// components/TaskList.js
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/TaskList.css';

function TaskList({ activeTab }) {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    pomodoros: 1,
    completed: 0,
    note: '',
    project: ''
  });

  const menuOptions = [
    { icon: '✓', label: 'Clear finished tasks' },
    { icon: '📋', label: 'Use Template' },
    { icon: '📥', label: 'Import from Todoist', locked: true },
    { icon: '✓', label: 'Clear act pomodoros' },
    { icon: '👁', label: 'Hide tasks', locked: true },
    { icon: '🗑', label: 'Clear all tasks' }
  ];

  // Handle clicking outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Handle clicking outside add task form
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAddTask && !event.target.closest('.add-task-form')) {
        setShowAddTask(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddTask]);

  const calculateEstimation = useCallback((pomodoros) => {
    const now = new Date();
  let totalMinutes = 0;
  
  switch(activeTab) {
    case 'Short Break':
      // 25 min pomodoro + 5 min short break
      totalMinutes = (pomodoros * 25) + (pomodoros * 5);
      break;
    case 'Long Break':
      // 25 min pomodoro + 15 min long break
      totalMinutes = (pomodoros * 25) + (pomodoros * 15);
      break;
    default:
      // Regular pomodoro mode: just 25 min work sessions
      totalMinutes = pomodoros * 25;
  }
  
  const finishTime = new Date(now.getTime() + totalMinutes * 60000);
  const hours = (totalMinutes / 60).toFixed(1);
  
  return {
    time: finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `(${hours}h)`
  };
}, [activeTab]);

  useEffect(() => {
    if (tasks.length > 0) {
      const updatedTasks = tasks.map(task => {
        const estimation = calculateEstimation(task.pomodoros);
        return {
          ...task,
          finishTime: estimation.time,
          duration: estimation.duration
        };
      });
      setTasks(updatedTasks);
    }
  }, [activeTab, calculateEstimation, tasks]);

  const handleSaveTask = () => {
    if (newTask.title.trim()) {
      const estimation = calculateEstimation(newTask.pomodoros);
      setTasks([...tasks, {
        ...newTask,
        id: Date.now(),
        finishTime: estimation.time,
        duration: estimation.duration
      }]);
      setShowAddTask(false);
      setNewTask({ title: '', pomodoros: 1, completed: 0, note: '', project: '' });
    }
  };

  const handlePomodoroChange = (increment) => {
    setNewTask(prev => ({
      ...prev,
      pomodoros: Math.max(1, prev.pomodoros + increment)
    }));
  };

  const handleMenuOption = (option) => {
    switch(option) {
      case 'Clear finished tasks':
        setTasks(tasks.filter(task => !task.completed));
        break;
      case 'Use Template':
        // Template functionality
        break;
      case 'Clear act pomodoros':
        setTasks(tasks.map(task => ({...task, completed: 0})));
        break;
      case 'Clear all tasks':
        setTasks([]);
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="task-list">
      <div className="task-header">
        <h2>Tasks</h2>
        <div className="menu-container">
          <button 
            className="menu-button" 
            onClick={() => setShowMenu(!showMenu)}
          >⋮</button>
          {showMenu && (
            <div className="menu-dropdown">
              {menuOptions.map((option, index) => (
                <button 
                  key={index} 
                  className={`menu-item ${option.locked ? 'locked' : ''}`}
                  onClick={() => handleMenuOption(option.label)}
                >
                  <span className="menu-icon">{option.icon}</span>
                  {option.label}
                  {option.locked && <span className="lock-icon">🔒</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <div className="task-item-header">
            <input type="checkbox" className="task-checkbox" />
            <span className="task-title">{task.title}</span>
            <span className="task-progress">{task.completed}/{task.pomodoros}</span>
          </div>
        </div>
      ))}
  
      <div className="add-task-container">
        <button 
          className="add-task-button"
          onClick={() => setShowAddTask(true)}
        >
          <span className="plus-icon">+</span> Add Task
        </button>
      </div>
  
      {showAddTask && (
        <div className="add-task-form-overlay">
          <div className="add-task-form">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="task-input"
              autoFocus
            />
            <div className="est-pomodoros">
              <span>Est Pomodoros</span>
              <div className="pomodoro-counter">
                <input
                  type="text"
                  value={newTask.pomodoros}
                  readOnly
                  className="pomodoro-input"
                />
                <div className="pomodoro-controls">
                  <button onClick={() => handlePomodoroChange(1)}>▲</button>
                  <button onClick={() => handlePomodoroChange(-1)}>▼</button>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <div className="additional-options">
                <button className="option-button">+ Add Note</button>
                <button className="option-button">+ Add Project</button>
              </div>
              <div className="save-actions">
                <button onClick={() => setShowAddTask(false)}>Cancel</button>
                <button className="save-button" onClick={handleSaveTask}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {tasks.length > 0 && (
        <div className="task-estimation">
          <div className="estimation-content">
            <span>Pomos: {tasks.reduce((acc, task) => acc + task.completed, 0)}/
            {tasks.reduce((acc, task) => acc + task.pomodoros, 0)}</span>
            <span className="estimation-divider">·</span>
            <span>Finish At: {tasks[tasks.length - 1]?.finishTime}</span>
            <span className="estimation-duration">{tasks[tasks.length - 1]?.duration}</span>
          </div>
        </div>
      )}
    </div>
  );
}  
export default TaskList;
