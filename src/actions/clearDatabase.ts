'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function clearAllAttendees() {
  if (!db) {
    return { success: false, message: 'Error de configuración del servidor: la base de datos no está disponible.' };
  }

  try {
    const attendeesCol = collection(db, 'attendees');
    const snapshot = await getDocs(attendeesCol);
    
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db!, 'attendees', docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    
    revalidatePath('/admin/attendees');
    
    return { 
      success: true, 
      message: `Se eliminaron ${snapshot.docs.length} registros de la base de datos.` 
    };
  } catch (error) {
    console.error("Error clearing attendees: ", error);
    return { 
      success: false, 
      message: 'Error al limpiar la base de datos. Verifica los permisos de Firestore.' 
    };
  }
}