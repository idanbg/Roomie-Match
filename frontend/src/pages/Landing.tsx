import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="mb-4">Welcome to Roomie Match 🏠</h1>
      <p className="lead mb-5">
        Find the perfect roommate easily and efficiently. Start now!
      </p>
      <div className="d-flex gap-3">
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-outline-primary btn-lg" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Landing;
