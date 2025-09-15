
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventDetailsProps {
  date: string;
  time: string;
  location: string;
}

const EventDetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="text-accent">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-primary-foreground">{label}</p>
      <p className="text-md text-accent">{value}</p>
    </div>
  </div>
);

const EventDetails: React.FC<EventDetailsProps> = ({ date, time, location }) => {
  return (
    <Card className="w-full max-w-md bg-transparent border-none shadow-none animate-in fade-in duration-1000 delay-700">
      <CardContent className="p-0">
        <div className="space-y-4">
          <EventDetailItem icon={<CalendarDays className="h-6 w-6" />} label="Date" value={date} />
          <EventDetailItem icon={<Clock className="h-6 w-6" />} label="Time" value={time} />
          <EventDetailItem icon={<MapPin className="h-6 w-6" />} label="Location" value={location} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
