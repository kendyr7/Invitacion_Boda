'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

export default function GuestLoginPage() {
  const [guestNames, setGuestNames] = useState<string[]>(['']);
  const [guestCount, setGuestCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Get the guest count from the referrer URL or session storage
    const getReferrerGuestCount = () => {
      // First try to get from session storage (if set from invitation page)
      const storedCount = sessionStorage.getItem('guestCount');
      if (storedCount) {
        return parseInt(storedCount, 10);
      }

      // Try to extract from document.referrer
      if (document.referrer) {
        const referrerUrl = new URL(document.referrer);
        const pathParts = referrerUrl.pathname.split('/');
        const invitationIndex = pathParts.indexOf('invitation');
        
        if (invitationIndex !== -1 && pathParts[invitationIndex + 1]) {
          const count = parseInt(pathParts[invitationIndex + 1], 10);
          if (!isNaN(count) && count > 0) {
            return count;
          }
        }
      }

      return 1; // Default to 1 guest
    };

    const count = getReferrerGuestCount();
    setGuestCount(count);
    setGuestNames(new Array(count).fill(''));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all guest names
    const validNames = guestNames.filter(name => name.trim());
    if (validNames.length !== guestCount) {
      toast({
        title: "Campos requeridos",
        description: `Por favor, ingresa ${guestCount === 1 ? 'tu nombre completo' : `los ${guestCount} nombres completos`}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store guest names in session storage for the confirmation page
      sessionStorage.setItem('guestNames', JSON.stringify(validNames));
      sessionStorage.setItem('guestCount', guestCount.toString());
      
      // Redirect to confirmation page
      router.push('/confirmation');
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...guestNames];
    newNames[index] = value;
    setGuestNames(newNames);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative">
      {/* Background Image */}
      <Image 
        src="/flowers_deco/elegant-background.jpeg"
        fill
        alt="Elegant event background" 
        className="absolute inset-0 z-[-1] opacity-20 filter blur-sm object-cover"
        priority
      />
      
      <div className="w-full max-w-md z-10">
        <Card className="bg-background/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl bg-[url('/paper-texture.jpg')] bg-cover bg-center">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/ring.png"
                alt="Wedding rings"
                width={60}
                height={60}
                className="opacity-80"
              />
            </div>
            <CardTitle className="text-2xl font-headline text-primary">Confirmación de Asistencia</CardTitle>
            <CardDescription className="text-foreground/70">
              {guestCount === 1 
                ? "Ingresa tu nombre para confirmar tu asistencia a la boda"
                : `Ingresa los nombres de los ${guestCount} invitados para confirmar su asistencia`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {guestNames.map((name, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`guestName${index}`} className="text-foreground/80">
                    {guestCount === 1 ? 'Nombre Completo' : `Nombre del Invitado ${index + 1}`}
                  </Label>
                  <Input
                    id={`guestName${index}`}
                    type="text"
                    placeholder={guestCount === 1 ? "Tu nombre y apellido" : `Nombre y apellido del invitado ${index + 1}`}
                    required
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="bg-white/80 border-primary text-center"
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-lg py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Continuar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-foreground/60">
                Fecha límite de confirmación: 28 de Noviembre 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}