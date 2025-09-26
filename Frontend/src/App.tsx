
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useState, type ReactElement } from "react";
import RefrshHandler from "./RefrshHandler";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  interface PrivateRouteProps {
    element: ReactElement;
  }

  const PrivateRoute = ({ element }: PrivateRouteProps): ReactElement => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;