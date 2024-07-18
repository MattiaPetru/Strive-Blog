// 400 - BAD REQUEST - Gestisce errori di richieste mal formate o dati non validi
export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    res.status(400).json({
      error: "RICHIESTA NON VALIDA",
      message: err.message,
    });
  } else {
    next(err);
  }
};

// 401 - UNAUTHORIZED - Gestisce errori di autenticazione
export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      error: "ERRORE DI AUTENTICAZIONE",
      message: "Richiesta nuova autenticazione",
    });
  } else {
    next(err);
  }
};

// 404 - NOT FOUND - Richieste a risorse non esistenti
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "RISORSA NON TROVATA",
    message: "La risorsa richiesta non è stata trovata",
  });
};

// 500 - INTERNAL SERVER ERROR - Gestisce tutti gli altri errori non specificati
export const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Errore generico",
  });
};
