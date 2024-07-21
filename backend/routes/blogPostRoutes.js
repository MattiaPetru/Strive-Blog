import express from "express";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary (CON CLOUDINARY)
import { sendEmail } from "../services/emailService.js"; // Import del codice per l'invio delle mail (INVIO MAIL)
import { authMiddleware } from "../middlewares/authMiddleware.js"; // NEW! middleware di autenticazione


const router = express.Router();


// Proteggi le altre rotte con il middleware di autenticazione
router.use(authMiddleware);

// GET /blogPosts: ritorna una lista di blog post
router.get("/", async (req, res) => {
  try {
    let query = {};
    // Se c'è un parametro 'title' nella query, crea un filtro per la ricerca case-insensitive
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" }; // Per fare ricerca case-insensitive:
      // Altrimenti per fare ricerca case-sensitive -> query.title = req.query.title;
    }
    // Cerca i blog post nel database usando il filtro
    const blogPosts = await BlogPost.find(query);
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/123: ritorna un singolo blog post
router.get("/:id", async (req, res) => {
  try {
    // Cerca un blog post specifico per ID
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /blogPosts: crea un nuovo blog post

router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      postData.cover = req.file.path;
    }
    const newPost = new BlogPost(postData);
    await newPost.save();

    // CODICE PER INVIO MAIL con MAILGUN
    const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>Ciao ${newPost.author},</p>
      <p>Il tuo post "${newPost.title}" è stato pubblicato con successo!</p>
      <p>Categoria: ${newPost.category}</p>
      <p>Grazie per il tuo contributo al blog!</p>
    `;

    await sendEmail(
      newPost.author,
      "Il tuo post è stato correttamente pubblicato",
      htmlContent
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// PUT modifica il blog post con l'id associato
router.put("/:id", async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    res.json(updatedBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE cancella il blog post con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    res.json({ message: "Blog post eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    blogPost.cover = req.file.path;
    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// GET ritorna tutti i commenti di uno specifico post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ritorna un commento specifico di un post specifico
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST aggiungi un nuovo commento ad un post specifico
router.post("/:id/comments", async (req, res) => {
  try {
    // Cerca il post nel database usando l'ID fornito
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    // Crea un nuovo oggetto commento con i dati forniti
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
    };
    // Aggiungi il nuovo commento all'array dei commenti del post
    post.comments.push(newComment);
    // Salva le modifiche nel database
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT cambia un commento di un post specifico
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    // Aggiorna il contenuto del commento
    comment.content = req.body.content;
    // Salva le modifiche nel database
    await post.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE elimina un commento specifico da un post specifico
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
