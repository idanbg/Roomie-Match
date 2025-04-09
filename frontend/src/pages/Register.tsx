import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Register.css";
import { motion } from "framer-motion";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", { username, email, password });

      await login(email, password);

      navigate("/home");
    } catch {
      setError("Registration failed.");
    }
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Register</h2>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit">
            Register
          </button>

          <div className="form-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;
