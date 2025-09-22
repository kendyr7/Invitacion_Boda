'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateAttendee } from '@/actions/attendees';
import { useToast } from '@/hooks/use-toast';
import { Attendee } from '@/actions/attendees';

interface EditAttendeeModalProps {
  attendee: Attendee | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditAttendeeModal({ attendee, isOpen, onClose, onSuccess }: EditAttendeeModalProps) {
  const [names, setNames] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Update form when attendee changes
  React.useEffect(() => {
    if (attendee) {
      setNames(attendee.names || []);
      setTableNumber(attendee.tableNumber?.toString() || '');
    }
  }, [attendee]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!attendee) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('attendeeId', attendee.id);
      formData.append('names', JSON.stringify(names.filter(name => name.trim())));
      formData.append('tableNumber', tableNumber);

      const result = await updateAttendee(formData);
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: result.message || 'Invitado actualizado correctamente',
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Error al actualizar el invitado',
          variant: 'destructive',
        });
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle>Editar Invitado</DialogTitle>
          <DialogDescription>
            Modifica la información del invitado y asigna un número de mesa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombres de Invitados</Label>
            {names.map((name, index) => (
              <div key={index} className="space-y-1">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Nombre del invitado ${index + 1}`}
                  required
                  disabled={isPending}
                  className="text-base"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Número de Mesa</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ej: 1, 2, 3..."
              min="1"
              disabled={isPending}
              className="text-base" // Better for mobile
            />
            <p className="text-sm text-muted-foreground">
              Deja vacío si no quieres asignar mesa
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || names.every(name => !name.trim())}
              className="w-full sm:w-auto"
            >
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}