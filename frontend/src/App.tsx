import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";
import UserProfile from "./pages/UserProfile";
import "../styles/theme.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
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

        {/* Profile route of currently logged-in user */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <UserProfile />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Profile route of another user by ID */}
        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              <AppLayout>
                <UserProfile />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
