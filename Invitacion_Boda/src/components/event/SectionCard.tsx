
"use client";
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react'; 

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  locationButton?: {
    text: string;
    url: string;
  };
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  animationDelay?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, locationButton, className, titleClassName, contentClassName, animationDelay }) => {
  const handleLocationClick = () => {
    if (locationButton) {
      window.open(locationButton.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`w-full max-w-md bg-transparent border-none shadow-none animate-in fade-in duration-700 mx-auto ${className}`} 
      style={{ animationDelay: animationDelay }}
    >
      <CardHeader className="pb-3 pt-5">
        <CardTitle className={`font-headline text-2xl sm:text-3xl text-primary flex items-center justify-center text-center ${titleClassName}`}>
          {icon && <span className="mr-3 text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`font-body text-base sm:text-lg text-foreground/90 space-y-2 text-center ${contentClassName}`}>
        {children}
        {locationButton && (
          <div className="mt-4 text-center">
            <Button
              onClick={handleLocationClick}
              variant="outline"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary hover:border-primary/90"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {locationButton.text}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCard;

    