import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/api"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/users/register", { username, email, password });
      navigate("/home");
    } catch  {
      setError( "Registration failed.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Register
        </button>
      </form>

      <div className="text-center mt-3">
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-outline-secondary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
