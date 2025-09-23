'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { CheckCircle, XCircle, Calendar, MapPin, Clock, Users, Gift, Info } from 'lucide-react';
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendConfirmationNotification } from '@/lib/emailjs';

interface ConfirmationStatus {
  isConfirmed: boolean;
  confirmedAt?: string;
  attendeeId?: string;
}

export default function ConfirmationPage() {
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(1);
  const [specialMessage, setSpecialMessage] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState<ConfirmationStatus>({ isConfirmed: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedGuestNames = sessionStorage.getItem('guestNames');
    const storedGuestCount = sessionStorage.getItem('guestCount');
    
    if (!storedGuestNames || !storedGuestCount) {
      router.push('/guest-login');
      return;
    }
    
    const names = JSON.parse(storedGuestNames);
    const count = parseInt(storedGuestCount, 10);
    
    setGuestNames(names);
    setGuestCount(count);
    checkConfirmationStatus(names);
  }, [router]);

  const checkConfirmationStatus = async (names: string[]) => {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      const attendeesRef = collection(db, 'attendees');
      // Check if any of the names are already confirmed
      const q = query(attendeesRef, where('names', 'array-contains-any', names));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const attendeeDoc = querySnapshot.docs[0];
        const data = attendeeDoc.data();
        setConfirmationStatus({
          isConfirmed: true,
          confirmedAt: data.confirmedAt?.toDate().toLocaleDateString('es-NI') || 'Fecha no disponible',
          attendeeId: attendeeDoc.id
        });
      } else {
        setConfirmationStatus({ isConfirmed: false });
      }
    } catch (error) {
      console.error('Error checking confirmation status:', error);
      toast({
        title: "Error",
        description: "No se pudo verificar el estado de confirmación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAttendance = async () => {
    setIsUpdating(true);
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      
      // Add attendee to database with multiple names
      const docRef = await addDoc(collection(db, 'attendees'), {
        names: guestNames, // Store array of names
        confirmedAt: new Date(),
        archived: false,
        numberOfGuests: guestCount, // Use actual guest count
        specialMessage: specialMessage.trim() || '' // Add special message to database
      });
      
      // Send email notification
      const notificationSent = await sendConfirmationNotification({
        guestName: guestNames.join(', '), // Join names for email
        numberOfGuests: 1,
        confirmationDate: new Date().toLocaleDateString('es-NI', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        specialMessage: specialMessage.trim() || 'Sin mensaje especial'
      });
      
      if (!notificationSent) {
        console.warn('Email notification failed to send, but confirmation was successful');
      }
      
      setConfirmationStatus({
        isConfirmed: true,
        confirmedAt: new Date().toLocaleDateString('es-NI'),
        attendeeId: docRef.id
      });
      
      toast({
        title: "¡Confirmación exitosa!",
        description: "Tu asistencia ha sido confirmada. ¡Nos vemos en la boda!",
      });
    } catch (error) {
      console.error('Error confirming attendance:', error);
      toast({
        title: "Error",
        description: "No se pudo confirmar tu asistencia. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelAttendance = async () => {
    if (!confirmationStatus.attendeeId) return;
    
    setIsUpdating(true);
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      const attendeeRef = doc(db, 'attendees', confirmationStatus.attendeeId);
      await updateDoc(attendeeRef, {
        archived: true
      });
      
      setConfirmationStatus({ isConfirmed: false });
      
      toast({
        title: "Confirmación cancelada",
        description: "Tu confirmación ha sido cancelada.",
      });
    } catch (error) {
      console.error('Error canceling attendance:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar tu confirmación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('guestName');
    router.push('/guest-login');
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Verificando estado de confirmación...</p>
        </div>
      </main>
    );
  }

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
      
      <div className="w-full max-w-2xl z-10 space-y-6">
        {/* Welcome Card */}
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
            <CardTitle className="text-2xl font-headline text-primary">
              ¡Hola, {guestNames.length > 1 ? guestNames.join(' y ') : guestNames[0]}!
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Estado de {guestCount > 1 ? 'su' : 'tu'} confirmación para la boda
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              {confirmationStatus.isConfirmed ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                      Confirmado
                    </Badge>
                    {confirmationStatus.confirmedAt && (
                      <p className="text-sm text-foreground/60 mt-1">
                        Confirmado el {confirmationStatus.confirmedAt}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-orange-500" />
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    Pendiente de confirmación
                  </Badge>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              {!confirmationStatus.isConfirmed && (
                <div className="space-y-2">
                  <Label htmlFor="special-message" className="text-sm font-medium text-foreground/80">
                    Mensaje especial (opcional)
                  </Label>
                  <Textarea
                    id="special-message"
                    placeholder="Escribe unas palabras especiales para los novios..."
                    value={specialMessage}
                    onChange={(e) => setSpecialMessage(e.target.value)}
                    className="min-h-[80px] resize-none bg-background/50 border-primary/20 focus:border-primary/50"
                    maxLength={200}
                  />
                  <p className="text-xs text-foreground/60 text-right">
                    {specialMessage.length}/200 caracteres
                  </p>
                </div>
              )}
              
              {!confirmationStatus.isConfirmed ? (
                <Button 
                  onClick={handleConfirmAttendance}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-lg py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Confirmando...' : 'Confirmar Asistencia'}
                </Button>
              ) : (
                <Button 
                  onClick={handleCancelAttendance}
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 font-headline text-lg py-3 rounded-lg"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Cancelando...' : 'Cancelar Confirmación'}
                </Button>
              )}
              
              <Button 
                onClick={handleBackToLogin}
                variant="ghost"
                className="w-full text-foreground/70 hover:text-foreground"
              >
                Cambiar nombre
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Details Card */}
        <Card className="bg-background/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl bg-[url('/paper-texture.jpg')] bg-cover bg-center">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary text-center">Detalles del Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Fecha</p>
                  <p className="text-sm text-foreground/70">Viernes, 20 de Diciembre 2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Hora</p>
                  <p className="text-sm text-foreground/70">6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Lugar</p>
                  <p className="text-sm text-foreground/70">Barrio San Judas, casa de habitación</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Código de Vestimenta</p>
                  <p className="text-sm text-foreground/70">Formal</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <p className="text-sm">Regalos: Agradecemos sus muestras de cariño en sobre</p>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <p className="text-sm">Le pedimos amablemente su presencia sin niños</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-foreground/60">
            Fecha límite de confirmación: 28 de Noviembre 2025
          </p>
        </div>
      </div>
    </main>
  );
}