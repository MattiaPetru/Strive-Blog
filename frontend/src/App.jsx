import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import { useState } from "react";

// Definisce il componente principale App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  />

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

            {/* Route per la pagina di dettaglio di un post */}
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;