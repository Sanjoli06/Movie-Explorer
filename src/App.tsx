import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

import UserDashboard from "./Components/UserDashBoard/UserDashboard";

// AppLayout separated to handle conditional layout logic
const AppLayout = () => {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        style={{ top: "20px" }}
      />
      <AppLayout />
    </Router>
  );
}

export default App;
