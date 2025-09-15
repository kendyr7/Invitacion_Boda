
"use client";
import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface ActivityTimelineItemProps {
  time: string;
  title: string;
  icon: ReactNode;
  align: 'left' | 'right';
}

const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({ time, title, icon, align }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentItemRef = itemRef.current; // Capture for use in cleanup

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set visibility based on whether the element is intersecting with the viewport
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px 0px -50px 0px', // Trigger when item is 50px from bottom of viewport
        threshold: 0.1, // Trigger when 10% of the item is visible
      }
    );

    if (currentItemRef) {
      observer.observe(currentItemRef);
    }

    return () => {
      if (currentItemRef) {
        observer.unobserve(currentItemRef);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  const eventDetails = (
    <div className={cn(
      "flex flex-col w-full px-1", 
      align === 'left' ? 'items-end text-right' : 'items-start text-left'
    )}>
      <div className="text-primary mb-1 sm:mb-2">{icon}</div>
      <h4 className="font-headline text-sm sm:text-base text-primary font-semibold uppercase leading-tight">{title}</h4>
      <p className="font-body text-xs sm:text-sm text-foreground/80 leading-tight">{time}</p>
    </div>
  );

  
  const gutterWidth = "w-10 sm:w-12 md:w-16"; 
  
  const contentPaneWidth = "w-[calc(50%-1.25rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(50%-2rem)]";


  return (
    <div
      ref={itemRef}
      className={cn(
        "relative flex w-full items-center transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0",
        !isVisible && align === 'left' ? "-translate-x-10" : "",
        !isVisible && align === 'right' ? "translate-x-10" : ""
      )}
    >
      {align === 'left' && (
        <>
          <div className={cn(contentPaneWidth, "flex justify-end items-center py-3 sm:py-4")}>
            {eventDetails}
          </div>
          <div className={cn(gutterWidth, "relative flex justify-center items-center shrink-0")}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background ring-1 ring-primary z-10"></div>
            <div className="w-full h-[1.5px] bg-primary absolute left-0 top-1/2 -translate-y-1/2 z-0"></div>
          </div>
          <div className={contentPaneWidth}></div> {/* Spacer */}
        </>
      )}

      {align === 'right' && (
        <>
          <div className={contentPaneWidth}></div> {/* Spacer */}
          <div className={cn(gutterWidth, "relative flex justify-center items-center shrink-0")}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background ring-1 ring-primary z-10"></div>
            <div className="w-full h-[1.5px] bg-primary absolute right-0 top-1/2 -translate-y-1/2 z-0"></div>
          </div>
          <div className={cn(contentPaneWidth, "flex justify-start items-center py-3 sm:py-4")}>
            {eventDetails}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityTimelineItem;
