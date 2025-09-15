
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
  name: string;
  confirmedAt: string; // Formatted date string
  archived: boolean;
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
        name: data.name,
        confirmedAt: data.confirmedAt ? formatTimestamp(data.confirmedAt as Timestamp) : 'Fecha no disponible',
        archived: data.archived || false,
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
