import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
