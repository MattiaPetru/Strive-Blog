import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import { useState } from "react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error("Errore nel recupero dei post:", error);
      }
    };
    fetchPosts();
  }, []);
  const handleSearch = (searchTerm) => {
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  onSearch={handleSearch}  />

        <main>
          <Routes>
            {/* Route per la pagina di registrazione */}
            <Route path="/register" element={<Register />} />

            {/* Route per la pagina di login */}
            <Route path="/login" element={<Login />} />

            {/* Route per la home page */}
            <Route path="/" element={<Home />} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;