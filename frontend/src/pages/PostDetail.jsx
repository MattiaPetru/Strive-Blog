import { useState, useEffect } from "react"; 
import { useParams, Link } from "react-router-dom"; 
import { getPost, getComments, addComment, getUserData } from "../services/api"; 
import "./PostDetail.css"; 


export default function PostDetail() {
  const [post, setPost] = useState(null); // Stato per memorizzare i dati del post
  const [comments, setComments] = useState([]); // Stato per memorizzare i commenti del post
  const [newComment, setNewComment] = useState({ content: "" }); // Stato per il nuovo commento da aggiungere
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per verificare se l'utente è loggato
  const [userData, setUserData] = useState(null); // Stato per memorizzare i dati dell'utente
  const { id } = useParams(); // Ottiene l'ID del post dai parametri dell'URL

  // Effettua il fetch dei dati del post e dei commenti al caricamento del componente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id); // Ottiene i dati del post dall'API
        setPost(postData); // Imposta i dati del post nello stato
      } catch (error) {
        console.error("Errore nel caricamento del post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id); // Ottiene i commenti del post dall'API
        setComments(commentsData); // Imposta i commenti nello stato
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
      if (token) {
        setIsLoggedIn(true); // Imposta lo stato di autenticazione a true
        try {
          const data = await getUserData(); // Ottiene i dati dell'utente autenticato dall'API
          setUserData(data); // Imposta i dati dell'utente nello stato
          fetchComments(); // Carica i commenti del post
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); 
          setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
        }
      } else {
        setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
      }
    };

    fetchPost(); // Carica i dati del post al caricamento del componente
    checkAuthAndFetchUserData(); // Verifica l'autenticazione e carica i dati dell'utente
  }, [id]); // Effettua nuovamente l'effetto quando l'ID del post cambia

  // Gestore per la sottomissione del nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const commentData = {
        content: newComment.content, // Contenuto del nuovo commento
        name: `${userData.nome} ${userData.cognome}`, // Nome dell'utente
        email: userData.email, // Email dell'utente
      };
      const newCommentData = await addComment(id, commentData); // Invia il nuovo commento all'API

      // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]); // Aggiunge il nuovo commento alla lista dei commenti
      setNewComment({ content: "" }); // Resetta il campo del nuovo commento
    } catch (error) {
      console.error("Errore nell'invio del commento:", error); // Logga l'errore in console
      alert(
        `Errore nell'invio del commento: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (!post) return <div>Caricamento in corso...</div>; // Mostra un messaggio di caricamento se i dati del post non sono ancora stati caricati

  // Rendering del componente
  return (
    <div className="container">
    <article className="post-detail">
      <header className="post-header">
        <img src={post.cover} alt={post.title} className="post-cover" />
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-category">Categoria: {post.category}</span>
          <span className="post-author">Autore: {post.author}</span>
          <span className="post-read-time">
            Tempo di lettura: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
      </header>

      <section className="post-content">
        <div
          className="post-text"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      <section className="comments-section">
        <h3 className="section-title">Commenti</h3>
        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p className="comment-content">{comment.content}</p>
                <small className="comment-author">Di: {comment.name}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">Non ci sono ancora commenti per questo post.</p>
        )}

        {isLoggedIn && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <h4 className="form-title">Aggiungi un commento</h4>
            <textarea
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              placeholder="Scrivi il tuo commento..."
              className="comment-input"
            />
            <button type="submit" className="submit-comment">Invia commento</button>
          </form>
        )}
      </section>
    </article>
  </div>
  );
}