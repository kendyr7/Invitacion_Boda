'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

export default function GuestLoginPage() {
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa tu nombre completo.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store guest name in session storage for the confirmation page
      sessionStorage.setItem('guestName', guestName.trim());
      
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
              Ingresa tu nombre para confirmar tu asistencia a la boda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-foreground/80">Nombre Completo</Label>
                <Input
                  id="guestName"
                  type="text"
                  placeholder="Tu nombre y apellido"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-white/80 border-primary text-center"
                  disabled={isLoading}
                />
              </div>
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