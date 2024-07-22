import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { getUserData } from "../services/api";
import SearchBar from "../pages/SearchBar.jsx";
import "./Navbar.css";


export default function Navbar({ isLoggedIn, setIsLoggedIn, onSearch }) {
  console.log("Navbar props:", props);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");

      if(token){
        try {
          await getUserData();
          setIsLoggedIn(true);
        } catch (error) {
          console.error("token non funzionante", error)
          localStorage.removeItem("token")
          setIsLoggedIn(false);
        }
      }else{
        setIsLoggedIn(false);
      }
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);

    window.addEventListener("loginStateChange", checkLoginStatus)

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/Login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Strive Blog
        </Link>
        <SearchBar onSearch={props.onSearch} />
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>
        <ul className={`navbar-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/create" className="nav-link">
                  Nuovo Post
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registrati
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}