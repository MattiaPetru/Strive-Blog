import mailgun from "mailgun-js";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Funzione per inviare email
export const sendEmail = async (to, subject, htmlContent) => {
  const data = {
    from: "Strive Blog <noreply@yourdomain.com>", // Mittente dell'email
    to, // Destinatario
    subject, // Oggetto dell'email
    html: htmlContent, // Contenuto HTML dell'email
  };

  try {
    // Invia l'email usando Mailgun
    const response = await mg.messages().send(data);
    console.log("Email inviata con successo:", response);
    return response;
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    throw error;
  }
};
