import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getPosts,getMe,deleteComment, deletePost } from "../services/api";
import SearchBar from "./SearchBar";
import "./Home.css";

export default function Home({ isLoggedIn, setIsLoggedIn, posts}) {
  // Stato per memorizzare l'array dei post
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  const navigate = useNavigate();
  // Effect hook per fetchare i post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere tutti i post
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Errore nella fetch del post:", error);
      }
    };
    fetchPosts();
  }, []);


  useEffect(() => {
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
      navigate("/");
    } catch (error) {
      console.error("Errore nell'eliminazione del post:", error);
    }
  };
  // Rendering del componente
  return (
    <div className="container">
      <h1>Lista dei Post</h1>
      <div className="post-grid">
        {Array.isArray(posts) && posts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id} className="post-card">
            <img src={post.cover} alt={post.title} className="post-image" />
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>Autore: {post.author}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" onClick={() => handleDeletePost(post._id)}>
             <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
             <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
            </div>
            
          </Link>
          
        ))}
      </div>
    </div>
  );
}
