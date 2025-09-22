
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
import { Users, Archive, ArchiveRestore, Trash2, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (attendeeId: string) => {
    setExpandedCard(expandedCard === attendeeId ? null : attendeeId);
  };

  return (
    <div className="space-y-3">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Invitado</TableHead>
              <TableHead>Mesa</TableHead>
              <TableHead>Mensaje Especial</TableHead>
              <TableHead>Fecha de Confirmación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">
                      {attendee.names.join(', ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {attendee.numberOfGuests} {attendee.numberOfGuests === 1 ? 'invitado' : 'invitados'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {attendee.tableNumber ? (
                    <Badge variant="secondary">Mesa {attendee.tableNumber}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  {attendee.specialMessage ? (
                    <div className="max-w-xs">
                      <p className="text-sm text-foreground/80 truncate" title={attendee.specialMessage}>
                        {attendee.specialMessage}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin mensaje</span>
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
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-3">
        {attendees.map((attendee) => (
          <Card key={attendee.id} className="w-full">
            <CardContent className="p-4">
              {/* Always visible header */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCard(attendee.id)}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg">
                    {attendee.names.join(', ')}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-xs">
                      {attendee.numberOfGuests} {attendee.numberOfGuests === 1 ? 'invitado' : 'invitados'}
                    </span>
                    {attendee.tableNumber ? (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <Badge variant="secondary" className="text-xs">Mesa {attendee.tableNumber}</Badge>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-muted-foreground text-xs">Sin mesa</span>
                      </>
                    )}
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-muted-foreground text-xs">{attendee.confirmedAt}</span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {expandedCard === attendee.id ? '▲' : '▼'}
                </div>
              </div>

              {/* Expandable details */}
              {expandedCard === attendee.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {/* Special Message */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mensaje Especial:</label>
                    {attendee.specialMessage ? (
                      <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                        {attendee.specialMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">Sin mensaje</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAttendee(attendee);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant={isArchived ? "default" : "destructive"}
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleArchive(attendee.id);
                      }}
                      className="flex-1"
                    >
                      {isArchived ? (
                        <>
                          <ArchiveRestore className="h-4 w-4 mr-2" />
                          Desarchivar
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          Archivar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {attendees.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          {isArchived ? 'No hay invitados archivados.' : 'Aún no hay invitados confirmados.'}
        </div>
      )}
    </div>
  );
};

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
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
    // Check if password is correct (you can change this password)
    const ADMIN_PASSWORD = "admin2024";
    
    if (deletePassword !== ADMIN_PASSWORD) {
      toast({
        title: "Error",
        description: "Contraseña incorrecta. No se puede proceder con la eliminación.",
        variant: "destructive",
      });
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
        // Close dialog and reset password
        setIsDeleteDialogOpen(false);
        setDeletePassword('');
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
      
      {/* Settings button in bottom right corner */}
      <div className="fixed bottom-6 right-6">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background border-2"
              title="Configuración de administrador"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Administrador
              </DialogTitle>
              <DialogDescription>
                Acciones administrativas avanzadas que requieren autenticación.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Limpiar Base de Datos
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Esta acción eliminará TODOS los registros de invitados de forma permanente. 
                  No se puede deshacer.
                </p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="admin-password" className="text-sm font-medium">
                      Contraseña de administrador:
                    </label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Ingresa la contraseña"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearDatabase}
                    disabled={isPending || !deletePassword.trim()}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isPending ? 'Eliminando...' : 'Confirmar Eliminación'}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletePassword('');
                }}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <EditAttendeeModal
        attendee={editingAttendee}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </main>
  );
}
