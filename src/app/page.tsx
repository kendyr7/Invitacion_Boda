
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative"
    >
        <Image 
            src="/flowers_deco/flowers_deco.png"
            fill
            alt="Elegant event background" 
            className="absolute inset-0 z-[-1] opacity-20 filter blur-sm object-cover"
            priority
            data-ai-hint="elegant floral"
        />
        <div className="text-center animate-in fade-in duration-1000 bg-background/80 backdrop-blur-md p-8 rounded-xl shadow-2xl">
            <Image 
                src="/ring.png"
                alt="Wedding rings"
                width={200}
                height={200}
                className="mx-auto"
                data-ai-hint="ring"
                priority
            />
            <h1 className="mt-4 font-headline text-3xl sm:text-4xl text-primary">Nuestra Boda</h1>
            <p className="font-richford text-2xl sm:text-3xl text-primary/90 mt-2">Kevin Zuniga & Alison Ney</p>
            <p className="mt-6 text-lg text-foreground/80 max-w-md">
                Por favor, utiliza el enlace de invitación personal que te fue enviado para ver los detalles completos.
            </p>
            
        </div>
    </main>
  );
}
