
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp, 
  query, 
  orderBy,
  getDoc
} from 'firebase/firestore';

export interface Attendee {
  id: string; // Firestore document ID
  names: string[]; // Array of names for multiple guests
  confirmedAt: string; // Formatted date string
  archived: boolean;
  tableNumber?: number; // Optional table assignment
  specialMessage?: string; // Special message from guest
  numberOfGuests: number; // Number of guests in this invitation
}

// A helper function to extract a useful error message
const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const firebaseError = error as any; // Cast to access potential 'code' property
    switch (firebaseError.code) {
      case 'permission-denied':
        return 'Error de permiso. Revisa las reglas de seguridad de Firestore en tu consola de Firebase para permitir escrituras en la colección "attendees".';
      case 'failed-precondition':
        return 'Error de Firestore: Falta un índice. Revisa la consola del servidor para ver un enlace para crearlo.';
      case 'unavailable':
        return 'El servicio de Firestore no está disponible. Revisa tu conexión a internet o el estado de Google Cloud.';
      default:
        return firebaseError.message || 'Ocurrió un error desconocido.';
    }
  }
  return 'Ocurrió un error desconocido.';
};

const formatTimestamp = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const formatter = new Intl.DateTimeFormat('es-NI', {
    timeZone: 'America/Managua',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  // The output for 'es-NI' is like "01/08/2025, 19:00". The comma needs to be removed.
  return formatter.format(date).replace(',', '');
};

export async function getAttendees(): Promise<Attendee[]> {
  if (!db) {
    console.error("Firestore is not initialized. Returning empty list.");
    return [];
  }
  try {
    const attendeesCol = collection(db, 'attendees');
    const q = query(attendeesCol, orderBy('confirmedAt', 'desc'));
    const attendeeSnapshot = await getDocs(q);
    const attendeeList = attendeeSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        names: data.names || [data.name] || [], // Handle both old and new format
        confirmedAt: data.confirmedAt ? formatTimestamp(data.confirmedAt as Timestamp) : 'Fecha no disponible',
        archived: data.archived || false,
        tableNumber: data.tableNumber || undefined,
        specialMessage: data.specialMessage || undefined,
        numberOfGuests: data.numberOfGuests || data.names?.length || 1, // Use numberOfGuests or names length
      };
    });
    return attendeeList;
  } catch (error) {
    console.error("Error fetching attendees: ", error);
    if ((error as any).code === 'failed-precondition') {
      console.error(
        'Firestore index not found. Please create the required index in your Firebase console. The error message should contain a link to create it.'
      );
    }
    return [];
  }
}

export async function toggleArchiveAttendee(formData: FormData) {
  if (!db) {
    return { success: false, message: 'Error de configuración del servidor: la base de datos no está disponible.' };
  }
  const attendeeId = formData.get('attendeeId') as string;

  if (!attendeeId) {
    return { success: false, message: 'ID de invitado inválido' };
  }

  const attendeeRef = doc(db, 'attendees', attendeeId);

  try {
    const attendeeSnap = await getDoc(attendeeRef);
    if (!attendeeSnap.exists()) {
      return { success: false, message: 'Invitado no encontrado' };
    }
    const currentArchivedState = attendeeSnap.data().archived;

    await updateDoc(attendeeRef, {
      archived: !currentArchivedState,
    });
    
    revalidatePath('/admin/attendees');
    
    return { success: true };
  } catch (error) {
    console.error("Error toggling archive state: ", error);
    const message = getFirebaseErrorMessage(error);
    return { success: false, message: message };
  }
}

export async function updateAttendee(formData: FormData) {
  if (!db) {
    return { success: false, message: 'Error de configuración del servidor: la base de datos no está disponible.' };
  }
  
  const attendeeId = formData.get('attendeeId') as string;
  const namesJson = formData.get('names') as string;
  const tableNumber = formData.get('tableNumber') as string;

  if (!attendeeId) {
    return { success: false, message: 'ID de invitado inválido' };
  }

  let names: string[] = [];
  try {
    names = JSON.parse(namesJson);
  } catch {
    return { success: false, message: 'Formato de nombres inválido' };
  }

  if (!names || names.length === 0 || names.every(name => !name.trim())) {
    return { success: false, message: 'Al menos un nombre de invitado es requerido' };
  }

  const attendeeRef = doc(db, 'attendees', attendeeId);

  try {
    const attendeeSnap = await getDoc(attendeeRef);
    if (!attendeeSnap.exists()) {
      return { success: false, message: 'Invitado no encontrado' };
    }

    const updateData: any = {
      names: names.map(name => name.trim()).filter(name => name),
      numberOfGuests: names.filter(name => name.trim()).length,
    };

    // Only update table number if provided
    if (tableNumber && tableNumber.trim() !== '') {
      const tableNum = parseInt(tableNumber.trim());
      if (!isNaN(tableNum) && tableNum > 0) {
        updateData.tableNumber = tableNum;
      } else {
        return { success: false, message: 'El número de mesa debe ser un número válido mayor a 0' };
      }
    } else {
      // Remove table number if empty
      updateData.tableNumber = null;
    }

    await updateDoc(attendeeRef, updateData);
    
    revalidatePath('/admin/attendees');
    
    return { success: true, message: 'Invitado actualizado correctamente' };
  } catch (error) {
    console.error("Error updating attendee: ", error);
    const message = getFirebaseErrorMessage(error);
    return { success: false, message: message };
  }
}
