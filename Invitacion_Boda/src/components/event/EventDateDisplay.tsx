"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";

interface EventDateDisplayProps {
  monthName: string;
  dayName: string;
  dayNumber: string;
  year: string;
  time?: string;
  className?: string;
}

const EventDateDisplay: FC<EventDateDisplayProps> = ({
  monthName,
  dayName,
  dayNumber,
  year,
  time = "6:00 PM",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center text-center w-full max-w-xs mx-auto text-gray-700", className)}>
      
      {/* MONTH */}
      <p className="uppercase tracking-widest text-base sm:text-lg font-body mb-2">
        {monthName}
      </p>

      {/* MIDDLE ROW */}
      <div className="flex items-center justify-between w-full">
        {/* LEFT - DAY NAME with LINES */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full border-t border-gray-400 mb-1"></div>
          <p className="uppercase text-sm sm:text-base font-body">{dayName}</p>
          <div className="w-full border-t border-gray-400 mt-1"></div>
        </div>

        {/* CENTER - DATE NUMBER */}
        <div className="px-4">
          <p className="text-6xl sm:text-7xl font-headline text-primary-900">
            {dayNumber}
          </p>
        </div>

        {/* RIGHT - YEAR with LINES */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full border-t border-gray-400 mb-1"></div>
          <p className="text-sm sm:text-base font-body">{year}</p>
          <div className="w-full border-t border-gray-400 mt-1"></div>
        </div>
      </div>

      {/* TIME */}
      <p className="uppercase tracking-wide text-sm sm:text-base font-body mt-3">
        {time}
      </p>
    </div>
  );
};

export default EventDateDisplay;
