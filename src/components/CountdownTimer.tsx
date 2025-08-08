import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center px-4 py-2 bg-red-600 rounded-full text-white font-bold text-sm mb-4 animate-pulse">
      <Clock className="w-4 h-4 mr-2" />
      OFERTA EXPIRA EN: {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </div>
  );
};

export default CountdownTimer;