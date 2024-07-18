import express from 'express';
import Author from '../models/Author.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import passport from '../config/passportConfig.js';


const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// POST restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Cerca l'autore nel database usando l'email
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    // Se le credenziali sono corrette, genera un token JWT
    const token = await generateJWT({ id: author._id });
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// GET restituisce l'autore collegato al token di accesso

router.get('/me', authMiddleware, (req, res) => {
  const authorData = req.author.toObject();
  delete authorData.password;
  res.json(authorData);
});

// Rotta per iniziare il processo di autenticazione Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rotta di callback per l'autenticazione Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);


async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error)
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}

export default router;