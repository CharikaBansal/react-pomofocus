// App.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Timer from './components/Timer';
import TimerControls from './components/TimerControls';
import TabSelector from './components/TabSelector';
import './App.css';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Pomodoro');
  const [time, setTime] = useState(() => {
    const tab = searchParams.get('tab') || 'Pomodoro';
    if (tab === 'Short Break') return 5 * 60;
    if (tab === 'Long Break') return 15 * 60;
    return 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const getTabMessage = (tab) => {
    switch(tab) {
      case 'Pomodoro':
        return 'Time to focus!';
      case 'Short Break':
        return 'Time for a break!';
      case 'Long Break':
        return 'Time for a long break!';
      default:
        return '';
    }
  };

    // Add eslint-disable comment to suppress the warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let intervalId;
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            const audio = new Audio('/sounds/alarm-bell.mp3');
            audio.play().catch(console.error);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Update URL when time changes
  useEffect(() => {
    setSearchParams({
      tab: activeTab,
      time: time.toString(),
      isRunning: isRunning.toString()
    });
  }, [time, activeTab, isRunning, setSearchParams]);

  // Handle tab changes
  useEffect(() => {
    const newTime = activeTab === 'Short Break' ? 5 * 60 : 
                   activeTab === 'Long Break' ? 15 * 60 : 25 * 60;
    setTime(newTime);
    setIsRunning(false);
  }, [activeTab]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update title immediately
    document.title = `${timeString} - ${getTabMessage(activeTab)}`;
    
    // Set up interval for continuous updates when not focused
    const intervalId = setInterval(() => {
      if (document.hidden && isRunning) {
        document.title = `${timeString} - ${getTabMessage(activeTab)}`;
      }
    }, 1000);
  
    return () => {
      clearInterval(intervalId);
      if (!isRunning) {
        document.title = 'Pomofocus';
      }
    };
  }, [time, activeTab, isRunning]);  
  


  const handleReset = () => {
    const resetTime = activeTab === 'Short Break' ? 5 * 60 : 
                     activeTab === 'Long Break' ? 15 * 60 : 25 * 60;
    setTime(resetTime);
    setIsRunning(false);
  };

  return (
    <div className={`App ${activeTab === 'Short Break' ? 'short-break' : ''} 
                        ${activeTab === 'Long Break' ? 'long-break' : ''}`}>
      <div className="timer-container">
        <TabSelector 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Timer time={time} />
        <TimerControls 
          isRunning={isRunning}
          onStartPause={handleStartPause}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}

export default App;
