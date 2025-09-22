'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
        }
    }, 100); 

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
          </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
