import multer from "multer";
import path from "path";

// Configura lo storage per multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Definisce il nome del file una volta caricato
  filename: (req, file, cb) => {
    // Crea un suffisso unico basato sulla data e un numero casuale
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crea un'istanza di multer con la configurazione dello storage
const upload = multer({ storage: storage });

export default upload;
