import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="landing-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
    </motion.div>
  );
};

export default Landing;
