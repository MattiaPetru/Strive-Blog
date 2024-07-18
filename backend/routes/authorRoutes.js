import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";

const router = express.Router();

// GET ritorna la lista degli autori
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ritorna il singolo autore
router.get("/:id", async (req, res) => {
  try {
    // Cerca un autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST crea un nuovo autore
router.post("/", async (req, res) => {

  const author = new Author(req.body);
  try {
    const newAuthor = await author.save();
    const authorResponse = newAuthor.toObject()
    delete authorResponse.password; //tolgo la password della response 
    res.status(201).json(authorResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT modifica l'autore con l'id associato
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE cancella l'autore con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json({ message: "Autore eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ricevi tutti i blog post di uno specifico autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    const blogPosts = await BlogPost.find({ author: author.email });
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH carica un'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }
    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    author.avatar = req.file.path;
    await author.save();
    res.json(author);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'avatar:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

export default router;
