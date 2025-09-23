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
import { Users } from 'lucide-react';

interface TableAssignmentModalProps {
  attendee: Attendee | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TableAssignmentModal({ attendee, isOpen, onClose, onSuccess }: TableAssignmentModalProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Update form when attendee changes
  React.useEffect(() => {
    if (attendee) {
      setTableNumber(attendee.tableNumber?.toString() || '');
    }
  }, [attendee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendee) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('attendeeId', attendee.id);
      formData.append('names', JSON.stringify(attendee.names));
      formData.append('tableNumber', tableNumber);

      const result = await updateAttendee(formData);

      if (result.success) {
        toast({
          title: "¡Mesa asignada!",
          description: `Mesa ${tableNumber || 'sin asignar'} asignada correctamente.`,
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo asignar la mesa.",
          variant: "destructive",
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
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Asignar Mesa
          </DialogTitle>
          <DialogDescription>
            Asigna un número de mesa para: <strong>{attendee?.names.join(', ')}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              Deja vacío para quitar la asignación de mesa
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
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? 'Asignando...' : 'Asignar Mesa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}