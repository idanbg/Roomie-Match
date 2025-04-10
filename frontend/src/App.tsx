import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";
import UserProfile from "./pages/UserProfile";
import MessagesPage from "./pages/MessagesPage";
import "./App.css";
import { AnimatePresence } from "framer-motion";
import ChatPage from "./pages/ChatPage";
import About from "./pages/About";

function App() {
  return (
    <AnimatePresence mode="wait">
      <div className="main-content">
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

            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <MessagesPage />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages/:userId"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <ChatPage />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <About/>
                  </AppLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </AnimatePresence>
  );
}

export default App;
