const controlloMail = (req, res, next) => {
  const emailAutorizzata = "autorizzato@mail.it";
  const mailUtente = req.headers["user-email"];

  if (mailUtente === emailAutorizzata) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "ACCESSO NEGATO: Utente non autorizzato." });
  }
};

export default controlloMail;
