import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export interface NotificationData {
  guestName: string;
  numberOfGuests: number;
  confirmationDate: string;
  specialMessage?: string;
}

export async function sendConfirmationNotification(data: NotificationData): Promise<boolean> {
  try {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      console.warn('EmailJS can only be used in browser environment');
      return false;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration is missing. Please check your environment variables.');
      console.error('Service ID:', EMAILJS_SERVICE_ID ? 'Present' : 'Missing');
      console.error('Template ID:', EMAILJS_TEMPLATE_ID ? 'Present' : 'Missing');
      console.error('Public Key:', EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing');
      return false;
    }

    // Initialize EmailJS with the public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const templateParams = {
      to_email: 'invitacionesdigitales505@gmail.com',
      guest_name: data.guestName,
      number_of_guests: data.numberOfGuests,
      confirmation_date: data.confirmationDate,
      special_message: data.specialMessage || 'Sin mensaje especial',
    };

    console.log('Sending email with params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Error type:', typeof error);
      console.error('Error stringified:', JSON.stringify(error));
    }
    
    // Check if it's an EmailJS specific error
    if (error && typeof error === 'object' && 'text' in error) {
      console.error('EmailJS error text:', (error as any).text);
    }
    if (error && typeof error === 'object' && 'status' in error) {
      console.error('EmailJS error status:', (error as any).status);
    }
    
    return false;
  }
}