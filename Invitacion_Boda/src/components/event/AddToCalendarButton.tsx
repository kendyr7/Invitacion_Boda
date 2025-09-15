
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px" {...props}>
        <path fill="#4285F4" d="M45,24H24v4h11.4c-1.6,4.7-6.1,8-11.4,8s-9.8-3.3-11.4-8H2v4c3.2,7.3,10.6,12,19,12c11.4,0,21-9.3,21-21 C42,12.7,44,19.2,45,24z"/>
        <path fill="#34A853" d="M22,44c5.1,0,9.6-1.7,12.8-4.5l-5.7-4.4C26.5,36.5,24.4,37,22,37c-5.3,0-9.8-3.6-11.4-8.5H4.9 C8.1,36.7,14.6,42,22,42z"/>
        <path fill="#FBBC05" d="M10.6,29.5c-0.6-1.8-1-3.6-1-5.5s0.3-3.7,1-5.5L4.9,14.1C3.3,17.3,2,21.2,2,24s1.3,6.7,3,9.9 L10.6,29.5z"/>
        <path fill="#EA4335" d="M22,11c3,0,5.6,1,7.7,3l4.8-4.8C31.6,4.7,27.2,2,22,2C14.6,2,8.1,7.3,4.9,15.5l5.7,4.4 C12.2,14.6,16.7,11,22,11z"/>
    </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.1,11.43a4.2,4.2,0,0,0-3.32-1.9,4.4,4.4,0,0,0-3.83,2.4,1,1,0,0,1-.82.45,1,1,0,0,1-.81-.45,4.43,4.43,0,0,0-3.8-2.4,4.18,4.18,0,0,0-3.35,1.91A4.5,4.5,0,0,0,2,15.65a4.44,4.44,0,0,0,4.74,4.27,1,1,0,0,1,1-.21,1,1,0,0,1,.45-.83,4.3,4.3,0,0,0,2.65-3.8,4.2,4.2,0,0,0-2.58-3.79,1,1,0,0,1-.55-1.12,1,1,0,0,1,1.13-.54,4.34,4.34,0,0,1,3.23,2.49,1,1,0,0,0,1.64,0,4.36,4.36,0,0,1,3.26-2.5,1,1,0,0,1,1.13.54,1,1,0,0,1-.55,1.12,4.2,4.2,0,0,0-2.58,3.79,4.3,4.3,0,0,0,2.62,3.8,1,1,0,0,1,.45.83,1,1,0,0,1,1,.21,4.44,4.44,0,0,0,4.74-4.27A4.53,4.53,0,0,0,19.1,11.43Zm-7.22,8.19a2.53,2.53,0,0,1-2-2.4,2.42,2.42,0,0,1,1.14-2.06,2.3,2.3,0,0,1,2.57.19,2.4,2.4,0,0,1-1.69,4.27ZM13.88,2.23a1,1,0,0,0-1,.84,2.5,2.5,0,0,1-4.72,0,1,1,0,0,0-1-.84,1,1,0,0,0-.83,1,4.5,4.5,0,0,0,4.23,3.21,4.5,4.5,0,0,0,4.23-3.21,1,1,0,0,0-.83-1Z"/>
    </svg>
);


interface EventDetails {
  title: string;
  description: string;
  location: string;
  receptionLocation?: string;
  ceremonyLocation?: string;
  startTime: string;
  endTime: string;
  timeZone: string; // e.g., "America/Managua"
}

interface AddToCalendarButtonProps {
  event: EventDetails;
  className?: string;
}

const formatUtc = (date: Date): string => {
  return formatInTimeZone(date, "UTC", "yyyyMMdd'T'HHmmss'Z'");
};

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({ event, className }) => {

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const timeZone = event.timeZone;

  const getFullDescription = (): string => {
    let fullDescription = event.description;
    if (event.ceremonyLocation) {
        fullDescription += `\n\nUbicación Ceremonia: ${event.ceremonyLocation}`;
    }
    if (event.receptionLocation) {
        fullDescription += `\n\nUbicación Recepción: ${event.receptionLocation}`;
    }
    return fullDescription;
  };
  
  const googleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${formatUtc(startDate)}/${formatUtc(endDate)}`,
      details: getFullDescription(),
      location: event.location,
      ctz: timeZone,
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const generateIcsContent = (): string => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART;TZID=${timeZone}:${formatInTimeZone(startDate, timeZone, "yyyyMMdd'T'HHmmss")}`,
      `DTEND;TZID=${timeZone}:${formatInTimeZone(endDate, timeZone, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${getFullDescription().replace(/\n/g, "\\n")}`,
      `LOCATION:${event.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };
  
  const handleIcsDownload = () => {
    const icsUri = generateIcsContent();
    const link = document.createElement("a");
    link.href = icsUri;
    link.download = "boda-axel-y-julissa.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary hover:border-primary/90 font-headline text-xl py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <CalendarPlus className="mr-2 h-5 w-5" />
          Guardar Fecha
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background/90 backdrop-blur-md">
        <DropdownMenuItem onClick={() => window.open(googleCalendarUrl(), '_blank')}>
          <GoogleIcon className="mr-2"/>
          <span>Google Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleIcsDownload}>
          <AppleIcon className="mr-2" />
          <span>Apple Calendar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToCalendarButton;
