
'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Archive, ArchiveRestore, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAttendees, toggleArchiveAttendee } from "@/actions/attendees";
import { clearAllAttendees } from "@/actions/clearDatabase";
import type { Attendee } from "@/actions/attendees";
import { useEffect } from 'react';
import { EditAttendeeModal } from '@/components/EditAttendeeModal';

const AttendeeTable = ({ attendees, isArchived, onToggleArchive, onClearDatabase, onEditAttendee }: { 
  attendees: Attendee[], 
  isArchived: boolean,
  onToggleArchive: (attendeeId: string) => void,
  onClearDatabase: () => void,
  onEditAttendee: (attendee: Attendee) => void
}) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Invitado</TableHead>
          <TableHead>Mesa</TableHead>
          <TableHead>Fecha de Confirmación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendees.map((attendee) => (
          <TableRow key={attendee.id}>
            <TableCell className="font-medium">{attendee.name}</TableCell>
            <TableCell>
              {attendee.tableNumber ? (
                <Badge variant="secondary">Mesa {attendee.tableNumber}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Sin asignar</span>
              )}
            </TableCell>
            <TableCell>{attendee.confirmedAt}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEditAttendee(attendee)}
                  title="Editar invitado"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onToggleArchive(attendee.id)}
                  title={isArchived ? 'Desarchivar invitado' : 'Archivar invitado'}
                >
                  {isArchived ? (
                   <ArchiveRestore className="h-4 w-4 text-primary" />
                 ) : (
                   <Archive className="h-4 w-4 text-destructive" />
                 )}
                  <span className="sr-only">{isArchived ? 'Desarchivar' : 'Archivar'}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
     {attendees.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          {isArchived ? 'No hay invitados archivados.' : 'Aún no hay invitados confirmados.'}
        </div>
      )}
  </div>
);

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttendees = async () => {
      const data = await getAttendees();
      setAttendees(data);
    };
    fetchAttendees();
  }, []);

  const handleToggleArchive = async (attendeeId: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('attendeeId', attendeeId);
      
      const result = await toggleArchiveAttendee(formData);
      
      if (result.success) {
        // Refresh attendees list
        const updatedAttendees = await getAttendees();
        setAttendees(updatedAttendees);
        toast({
          title: "Éxito",
          description: "Estado del invitado actualizado correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo actualizar el estado del invitado.",
          variant: "destructive",
        });
      }
    });
  };

  const handleEditAttendee = (attendee: Attendee) => {
    setEditingAttendee(attendee);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    // Refresh attendees list after successful edit
    const updatedAttendees = await getAttendees();
    setAttendees(updatedAttendees);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAttendee(null);
  };

  const handleClearDatabase = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los registros de la base de datos? Esta acción no se puede deshacer.')) {
      return;
    }
    
    startTransition(async () => {
      const result = await clearAllAttendees();
      
      if (result.success) {
        // Refresh attendees list
        const updatedAttendees = await getAttendees();
        setAttendees(updatedAttendees);
        toast({
          title: "Éxito",
          description: result.message || "Base de datos limpiada correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo limpiar la base de datos.",
          variant: "destructive",
        });
      }
    });
  };
  
  const activeAttendees = attendees.filter(a => !a.archived);
  const archivedAttendees = attendees.filter(a => a.archived);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 pt-0 sm:p-8">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl text-primary">
              <Users className="h-8 w-8" />
              <span>Gestión de Invitados</span>
            </CardTitle>
            <div className="flex items-center justify-end gap-3 text-right">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearDatabase}
                  disabled={isPending}
                  className="mr-3"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Base de Datos
                </Button>
                <span className="text-lg font-medium text-muted-foreground">Total Confirmados:</span>
                <Badge className="text-xl px-4 py-1">{activeAttendees.length}</Badge>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Confirmados</TabsTrigger>
              <TabsTrigger value="archived">Archivados</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
               <AttendeeTable 
                 attendees={activeAttendees} 
                 isArchived={false} 
                 onToggleArchive={handleToggleArchive}
                 onClearDatabase={handleClearDatabase}
                 onEditAttendee={handleEditAttendee}
               />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <AttendeeTable 
                attendees={archivedAttendees} 
                isArchived={true} 
                onToggleArchive={handleToggleArchive}
                onClearDatabase={handleClearDatabase}
                onEditAttendee={handleEditAttendee}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <EditAttendeeModal
        attendee={editingAttendee}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </main>
  );
}
