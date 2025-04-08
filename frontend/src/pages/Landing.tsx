import { useNavigate } from "react-router-dom";
import "../../styles/Landing.css";


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="landing-content">
          <h1 className="title">Roomie Match</h1>
          <p className="subtitle">Find your vibe. Find your roommate.</p>
          <div className="button-group">
            <button className="btn primary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn secondary" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;