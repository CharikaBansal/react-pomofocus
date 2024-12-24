// hooks/useSound.js
import { useCallback } from 'react';

const useSound = () => {
  const playSound = useCallback(() => {
    const audio = new Audio('/sounds/button-press.wav');
    audio.volume = 0.5;
    audio.play().catch(error => console.log('Audio play failed:', error));
  }, []);

  return playSound;
};

export default useSound;
