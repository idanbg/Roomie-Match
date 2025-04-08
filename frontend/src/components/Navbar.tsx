import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";

const AppNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          🏠 Roomie Match
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>

            {user && (
              <Nav.Link as={Link} to={`/users/${user.id}`}>
                Profile
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/about">About</Nav.Link>

            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="ms-2 me-2"
            >
              Logout
            </Button>

            {user?.profileImage && (
              <Link to={`/users/${user.id}`}>
                <Image
                  src={`http://localhost:3000${user.profileImage}`}
                  roundedCircle
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                  alt="Profile"
                />
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
