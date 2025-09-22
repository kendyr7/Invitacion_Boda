'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, User, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(user, password);
    if (success) {
      toast({
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso. Redirigiendo...",
        variant: "default",
      });
      setTimeout(() => {
        router.push('/admin/attendees');
      }, 500);
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with logo/icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Portal Administrativo</h1>
          <p className="text-muted-foreground">Acceso seguro al sistema de gestión</p>
        </div>

        <Card className="w-full shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="user" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Usuario / Email
                </Label>
                <Input
                  id="user"
                  type="text"
                  placeholder="Ingresa tu usuario o email"
                  required
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium transition-all duration-200 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            {/* Security notice */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Conexión segura y cifrada
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Sistema de Gestión de Invitados • Versión 2.0
          </p>
        </div>
      </div>
    </main>
  );
}