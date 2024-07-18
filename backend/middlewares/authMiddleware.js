import { verifyJWT } from '../utils/jwt.js';
import Author from '../models/Author.js';

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrai il token dall'header Authorization
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Se non c'è un token, restituisci un errore 401 (Unauthorized)
    if (!token) {
      return res.status(401).send('Token mancante');
    }
    // Verifica e decodifica il token usando la funzione verifyJWT
    const decoded = await verifyJWT(token);

    // Usa l'ID dell'autore dal token per trovare l'autore nel database
    const author = await Author.findById(decoded.id).select('-password');

    // Se l'autore non viene trovato nel database, restituisci un errore 401
    if (!author) {
      return res.status(401).send('Autore non trovato');
    }
    req.author = author;
    next();
  } catch (error) {
    res.status(401).send('Token non valido');
  }
};