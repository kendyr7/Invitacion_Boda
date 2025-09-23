
"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft: TimeLeft = {};

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return newTimeLeft;
    };
    
    setTimeLeft(calculateTimeLeft()); // Initial calculation

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isClient]);

  if (!isClient) {
    // Render placeholder or skeleton on server/initial client render
    return (
      <div className="grid grid-cols-4 gap-4 text-center animate-in fade-in duration-1000 delay-500">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="text-3xl sm:text-4xl  font-bold text-primary animate-pulse">--</div>
            <div className="text-xs sm:text-sm text-primary uppercase tracking-wider">Loading...</div>
          </div>
        ))}
      </div>
    );
 }
  
  const timerComponents = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 text-center animate-in fade-in duration-1000 delay-500 w-full max-w-md">
      {timerComponents.map((component, index) => (
        component.value !== undefined && (
          <div key={index} className="p-3 sm:p-4 transform transition-all hover:scale-120">
            <div className="text-4xl sm:text-6xl font-headline font-bold text-primary mb-2 earfline-font">
              {String(component.value).padStart(2, '0')}&nbsp;
            </div>
            <div className="text-sm sm:text-base text-primary uppercase tracking-wider font-body">
              {component.label}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default CountdownTimer;

    
