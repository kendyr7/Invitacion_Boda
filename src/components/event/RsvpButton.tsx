
"use client";

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface RsvpButtonProps {
  phoneNumber: string; 
  message: string;
  className?: string;
  disabled?: boolean;
}

const RsvpButton: React.FC<RsvpButtonProps> = ({ phoneNumber, message, className, disabled }) => {
  const handleRsvp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleRsvp}
      className={className || "bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-lg py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-in fade-in duration-1000 delay-900"}
      aria-label="Confirm attendance via WhatsApp"
      disabled={disabled}
    >
      Confirmar aquí
      <ExternalLink className="ml-2 h-5 w-5" />
    </Button>
  );
};

export default RsvpButton;
