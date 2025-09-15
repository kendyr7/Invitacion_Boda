
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
import { Users, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { getAttendees, toggleArchiveAttendee } from "@/actions/attendees";
import type { Attendee } from "@/actions/attendees";

const AttendeeTable = ({ attendees, isArchived }: { attendees: Attendee[], isArchived: boolean }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Invitado</TableHead>
          <TableHead>Fecha de Confirmación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendees.map((attendee) => (
          <TableRow key={attendee.id}>
            <TableCell className="font-medium">{attendee.name}</TableCell>
            <TableCell>{attendee.confirmedAt}</TableCell>
            <TableCell className="text-right">
               <form action={toggleArchiveAttendee}>
                 <input type="hidden" name="attendeeId" value={attendee.id} />
                 <Button variant="ghost" size="icon" type="submit">
                   {isArchived ? (
                     <ArchiveRestore className="h-4 w-4 text-primary" />
                   ) : (
                     <Archive className="h-4 w-4 text-destructive" />
                   )}
                   <span className="sr-only">{isArchived ? 'Desarchivar' : 'Archivar'}</span>
                 </Button>
               </form>
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

export default async function AttendeesPage() {
  const allAttendees = await getAttendees();
  
  const activeAttendees = allAttendees.filter(a => !a.archived);
  const archivedAttendees = allAttendees.filter(a => a.archived);

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
               <AttendeeTable attendees={activeAttendees} isArchived={false} />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <AttendeeTable attendees={archivedAttendees} isArchived={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
