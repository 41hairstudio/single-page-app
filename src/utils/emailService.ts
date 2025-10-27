import emailjs from 'emailjs-com';

// Configuración de EmailJS desde variables de entorno
// Las variables deben estar definidas en el archivo .env
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID_CLIENT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CLIENT || '';
const EMAILJS_TEMPLATE_ID_BARBER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_BARBER || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

interface EmailParams {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

export const sendClientEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: params.email,
      to_name: params.name,
      date: params.date,
      time: params.time,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CLIENT,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Error enviando email al cliente:', error);
    return false;
  }
};

export const sendBarberEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      client_name: params.name,
      client_email: params.email,
      client_phone: params.phone,
      date: params.date,
      time: params.time,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_BARBER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Error enviando email al peluquero:', error);
    return false;
  }
};

export const sendConfirmationEmails = async (params: EmailParams): Promise<boolean> => {
  try {
    // Enviar ambos emails en paralelo
    const [clientResult, barberResult] = await Promise.all([
      sendClientEmail(params),
      sendBarberEmail(params)
    ]);
    
    return clientResult && barberResult;
  } catch (error) {
    console.error('Error enviando emails de confirmación:', error);
    return false;
  }
};
