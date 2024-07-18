import { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { loginUser } from "../services/api"; 
import { FaGoogle } from 'react-icons/fa';
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "", // Stato iniziale del campo email
    password: "", // Stato iniziale del campo password
  });
  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina

  const location = useLocation(); //parametri url

  useEffect(()=> {
     //prendo i paramtri url
     const params = new URLSearchParams(location.search);
     const token = params.get("token");
     if(token){
      //se c'è salvo local storage
      localStorage.setItem("token", token);

      window.dispatchEvent(new Event("storage"));
      navigate("/")
     }  
  },[location, navigate])

  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };



  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      console.log("Login effettuato con successo!"); // Mostra un messaggio di successo
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };


  const handleGoogleLogin = () => {

    window.location.href = `${API_URL}/api/auth/google`;
  }

  return (
<div className="login-container">
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-button">Accedi</button>
        <div className="or-divider">oppure</div>
        <button onClick={handleGoogleLogin} className="google-login-button">
          <FaGoogle className="google-icon" />
          <span>Accedi con Google</span>
        </button>
      </form>
    </div>
  </div>
  );
}