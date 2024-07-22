import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";
import "./CreatePost.css";


export default function CreatePost() {

  const [error, setError] = useState(null);
  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Nuovo stato per gestire il file di copertina
  const [coverFile, setCoverFile] = useState(null);


  const navigate = useNavigate();

  //useEffect per l'autenticazione
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  // Nuovo gestore per il cambiamento del file di copertina
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creiamo un oggetto FormData per inviare sia i dati del post che il file
      const formData = new FormData();

      // Aggiungiamo tutti i campi del post al FormData
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiungiamo il file di copertina se presente
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Invia i dati del post al backend
      const response = await createPost(formData);
      console.log('Post creato:', response);
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
      setError(error.response?.data?.message || "Si è verificato un errore durante la creazione del post");
      // Dopo 1 secondo, aggiorna il messaggio di errore
    setTimeout(() => {
      setError((prevError) => prevError + " Reindirizzamento alla home tra 2 secondi...");
    }, 1000);
      setTimeout(() => {
        navigate("/");
      }, 3000); // 3000 millisecondi = 3 secondi
    }
  };

  // Template del componente
  return (
    <div className="container">
      <h1>Crea un nuovo post</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Titolo</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contenuto</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Immagine di copertina</label>
          <input
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tempo di lettura (minuti)</label>
          <input
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
          />
        </div>
       
        <div className="form-group">
          <label>Email autore</label>
          <input
            type="email"
            id="author"
            name="author"
            value={post.author}
            readOnly
          />
        </div>
        
        <button type="submit" className="submit-button">
          Crea il post
        </button>
      </form>
    </div>
  );
}