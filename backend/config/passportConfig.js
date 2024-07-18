import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

//strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se esiste già un autore con questo ID Google
        let author = await Author.findOne({ googleId: profile.id });

        console.log("LOG AUTORE", author);

        // Se l'autore non esiste, ne creiamo uno nuovo
        if (!author) {
          author = new Author({
            googleId: profile.id, // ID univoco fornito da Google
            nome: profile.name.givenName,
            cognome: profile.name.familyName,
            email: profile.emails[0].value,
            dataDiNascita: null,
          });
          await author.save();
        }
        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  // Memorizziamo solo l'ID dell'utente nella sessione
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;