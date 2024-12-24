// components/Timer.js
import React from 'react';
import '../styles/Timer.css';

function Timer({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer">
      <div className="time-display">
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

export default Timer;
