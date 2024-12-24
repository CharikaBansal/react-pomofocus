// components/TimerControls.js
import React from 'react';
import useSound from '../hooks/useSound';
import '../styles/TimerControls.css';

const TimerControls = ({ isRunning, onStartPause, onReset }) => {
  const playSound = useSound();

  const handleStartPause = () => {
    playSound();
    onStartPause();
  };

  const handleReset = () => {
    playSound();
    onReset();
  };

  return (
    <div className="timer-controls">
      <button 
        className="control-button primary-button" 
        onClick={handleStartPause}
      >
        {isRunning ? 'PAUSE' : 'START'}
      </button>
      <button 
        className="control-button secondary-button" 
        onClick={handleReset}
      >
        RESET
      </button>
    </div>
  );
};

export default TimerControls;
