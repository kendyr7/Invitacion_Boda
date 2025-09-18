
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MusicPlayer from '@/components/event/MusicPlayer';
import CountdownTimer from '@/components/event/CountdownTimer';
import { Card, CardContent } from '@/components/ui/card';
import SectionCard from '@/components/event/SectionCard';
import EventDateDisplay from '@/components/event/EventDateDisplay';

import { 
  Gift, 
  ListChecks,
  Info,
  ArrowUp,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import AddToCalendarButton from '@/components/event/AddToCalendarButton';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export default function InvitationPageClient({ guestCount }: { guestCount: number }) {
  const [isOpened, setIsOpened] = useState(false);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const audioSrc = "/audio/until-i-found-you.mp3"; 
  const eventTargetDate = "2025-12-20T18:00:00-06:00";

  useEffect(() => {
    if (!isOpened) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpened]);
  
  const handleOpenEnvelope = () => {
    setIsOpened(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleConfirm = () => {
    // Redirect to guest login page for confirmation
    router.push('/guest-login');
  };

  if (!isOpened) {
    return (
      <main 
        className="flex min-h-screen flex-col items-center justify-center bg-background p-4 cursor-pointer" 
        onClick={handleOpenEnvelope}
      >
        <div className="text-center animate-in fade-in duration-1000">
          <Image 
            src="/envelope.png"
            alt="An envelope, click to open invitation"
            width={400}
            height={300}
            className="mx-auto"
            data-ai-hint="envelope mail"
            priority
          />
          <p className="mt-4 text-lg text-foreground/80 font-headline">Haz clic para abrir la invitación</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-auto sm:overflow-hidden">
      <Image 
        src="/flowers_deco/elegant-background.jpeg"
        fill
        alt="Elegant event background" 
        className="absolute inset-0 z-[-1] opacity-20 filter blur-sm object-cover"
        priority
        data-ai-hint="elegant floral"
      />
      
      <div 
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full bg-background/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-2xl my-8 animate-in fade-in slide-in-from-bottom-10 duration-700 bg-[url('/paper-texture.jpg')] bg-cover bg-center overflow-hidden"
      >
        <div className="mt-12 relative z-10 flex flex-col items-center text-center space-y-8 sm:space-y-10 p-4 sm:p-8">
        
          <Card className="bg-transparent border-none shadow-none w-full animate-in fade-in duration-1000 delay-200">
            <CardContent className="font-body text-lg sm:text-xl text-foreground/80 pt-6">
              <p>
                ... No me ruegues que te deje y que me <br />aparte de ti; porque adondequiera que <br />tú fueres, iré yo, y dondequiera que <br />vivieres, viviré. Tu pueblo será<br /> mi pueblo, y tu Dios mi Dios.
              </p>
              <p className='mt-2 text-foreground/50'>- Ruth 1:16</p>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center mt-8 mb-6 animate-in fade-in duration-1000 delay-300">
            <Image src="/ring.png" alt="Ring" width={300} height={300} data-ai-hint="ring" className="drop-shadow-lg"/>
            <p className="font-headline text-2xl sm:text-3xl text-primary mt-2 tracking-widest">Nuestra Boda</p>
          </div>

          <div className="animate-in fade-in duration-1000 delay-400 mb-4 sm:mb-6 w-full text-center">
            <h1 className="text-4xl sm:text-5xl text-primary flex flex-col items-center justify-center">
              <span className="font-richford">Kevin Zuniga</span>
              <span className="font-eve-adam text-2xl sm:text-2xl my-2">&</span>
              <span className="font-richford">Alison Ney</span>
            </h1>
          </div>
          
          <MusicPlayer audioSrc={audioSrc} autoPlay={isOpened} className="animate-in fade-in duration-1000 delay-500" />

          <Card className="bg-transparent border-none shadow-none w-full animate-in fade-in duration-1000 delay-600">
            <CardContent className="font-body text-lg sm:text-xl text-foreground/80 pt-6">
              <p>
               Con la bendición de Dios y nuestros padres<br />Unimos nuestras vidas en Matrimonio y seria un honor<br />contar con su presencia en este dia tan especial.
              </p>
            </CardContent>
          </Card>

          <EventDateDisplay 
            monthName="Diciembre"
            dayName="Viernes"
            dayNumber="20"
            year="2025"
            time="6:00 PM"
            className="animate-in fade-in duration-1000 delay-700 text-primary"
          />
        </div>

        <div className="w-full bg-[#f4f0ed] my-8 py-8 animate-in fade-in duration-1000 delay-800 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-md mx-auto">
            <CountdownTimer targetDate={eventTargetDate} />
          </div>
          <AddToCalendarButton 
             event={{
                title: "Nuestra Boda - Alison Ney & Kevin Zuniga",
                description: "¡Acompáñanos a celebrar nuestra unión! Te esperamos para compartir este día tan especial.",
                location: "Restaurante El Horizonte, Carretera Chinandega",
                receptionLocation: "https://maps.app.goo.gl/SzXAqsLcjhAFVoXa9?g_st=iw",
                ceremonyLocation: "https://maps.app.goo.gl/EnDGVqjE2e7bHwrK9?g_st=iw",
                startTime: eventTargetDate,
                endTime: "2025-12-21T02:00:00-06:00",
                timeZone: "America/Managua",
             }}
          />
        </div>

        <Image 
            src="/decor_image3.png"
            alt="Decoration Image"
            width={250}
            height={100}
            className="mx-auto my-4"
            data-ai-hint="pink flower"
          />
        
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10 p-4 sm:p-8 pt-0">
          
          <div className="w-full animate-in fade-in duration-1000 delay-1000">
            <SectionCard
              title="Ceremonia Religiosa"
              locationButton={{ text: "Ver Ubicación", url: "https://maps.app.goo.gl/EnDGVqjE2e7bHwrK9?g_st=iw" }}
              titleClassName="text-primary"
            >
              <div className="flex flex-col items-center space-y-2 mb-3">
                 <Image src="/church.png" alt="Iglesia Icon" width={40} height={40} className="shrink-0" data-ai-hint="church building"/>
              </div>
              <div className="mt-1 space-y-1 text-center">
                <p className="flex items-center justify-center">Iglesia Parroquial San Blas</p>
                <p className="flex items-center justify-center"><i>Chichigalpa, 4:30 PM</i></p>
              </div>
            </SectionCard>
          </div>
          
          <div className="w-full animate-in fade-in duration-1000 delay-1100">
            <SectionCard 
              title="Recepción"
              locationButton={{ text: "Ver Ubicación", url: "https://maps.app.goo.gl/SzXAqsLcjhAFVoXa9?g_st=iw" }}
              titleClassName="text-primary"
            >
              <div className="flex flex-col items-center space-y-2 mb-3">
                <Image src="/champagne.png" alt="champagne Icon" width={40} height={40} className="shrink-0" data-ai-hint="champagne"/>
              </div>
              <div className="mt-1 space-y-1 text-center">
                <p className="flex items-center justify-center">Restaurante El Horizonte</p>
                <p className="flex items-center justify-center"><i>Carretera Chinandega, 6:00 PM</i></p>
              </div>
            </SectionCard>
          </div>

          <div className="w-full animate-in fade-in duration-1000 delay-[1300ms]">
            <SectionCard 
              title="Código de Vestimenta"
              titleClassName="text-primary"
            >
              <div>
                <p className='text-sm sm:text-base font-bold'>Formal</p>
              </div>
               <Image src="/dress-codex.png" alt="Código de Vestimenta Formal" width={200} height={200} className="mx-auto mt-3 mb-3" data-ai-hint="formal attire" />
               <p className="text-base sm:text-lg text-foreground/90"><br />Con cariño te pedimos considerar color BLANCO reservado únicamente para la novia.</p>
            </SectionCard>
          </div>
          
          <div className="w-full animate-in fade-in duration-1000 delay-[1400ms]">
            <SectionCard 
              title="Pase Personal" 
              icon={<UserCheck size={28} className="text-primary"/>}
              titleClassName="text-primary"
            >
              <p className="text-lg sm:text-xl font-bold text-foreground/90">
                Invitación Válida para {guestCount} persona{guestCount > 1 ? 's' : ''}
              </p>
               <p className="text-sm text-foreground/70 mt-2 px-4">
                 Este pase es personal e intransferible.
               </p>
            </SectionCard>
          </div>

          <div className="w-full animate-in fade-in duration-1000 delay-[1500ms]">
            <SectionCard 
              title="Regalos" 
              icon={<Gift size={28} className="text-primary"/>}
              titleClassName="text-primary"
            >
              <p className="flex items-center justify-center gap-2">
                <span>Agradecemos sus muestras de cariño en sobre.</span>
              </p>
            </SectionCard>
          </div>

          <div className="w-full animate-in fade-in duration-1000 delay-[1700ms]">
             <SectionCard
              title="Nota Importante"
              icon={<Info size={24} className="text-primary" />}
              titleClassName="text-primary"
             >
                <p className="text-base sm:text-lg text-foreground/90 px-4">
                  Le pedimos amablemente su presencia sin niños.
                </p>
             </SectionCard>
          </div>
        </div>
        
        <div 
          className="relative w-full bg-[url('/flowers_deco/flower2.png')] bg-contain bg-no-repeat bg-bottom"
        >
          <div className="flex flex-col items-center pt-10 pb-24 px-4">
            <div className="flex flex-col items-center animate-in fade-in duration-1000 delay-[200ms] w-full max-w-xs">
              <Button
                onClick={handleConfirm}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-xl py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full mb-2"
                aria-label="Confirmar asistencia"
              >
                Confirmar Asistencia
              </Button>
              <p className="text-sm text-foreground/80 mt-2 text-center">
                Fecha Límite de confirmación 30 de Julio
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-4 bg-background/80 dark:bg-neutral-900/80 text-foreground/60 text-xs bg-[url('/paper-texture.jpg')] bg-cover bg-center backdrop-blur-md">
          <a 
            href="https://www.instagram.com/invitaciones_digitales_505?utm_source=ig_web_button_share_sheet&igsh=cWl4ZGN1ZjR3ODlw" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            <span>Invitaciones Digitales 505</span>
          </a>
        </footer>

      </div>
       {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-primary/80 backdrop-blur-sm p-0 text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:bg-primary"
          aria-label="Volver al inicio"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </main>
  );
}
