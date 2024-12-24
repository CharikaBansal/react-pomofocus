// components/TabSelector.js
import React from 'react';
import useSound from '../hooks/useSound';
import '../styles/TabSelector.css';

function TabSelector({ activeTab, setActiveTab }) {
  const playSound = useSound();
  
  const handleTabClick = (tab) => {
    playSound();
    setActiveTab(tab);
  };

  return (
    <div className="tab-selector">
      {['Pomodoro', 'Short Break', 'Long Break'].map(tab => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default TabSelector;
