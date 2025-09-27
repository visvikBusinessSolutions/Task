import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface RefrshHandlerProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const RefrshHandler: React.FC<RefrshHandlerProps> = ({
  setIsAuthenticated,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"||
        location.pathname === "/home"
      ) {
        navigate("/home", { replace: false });
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

export default RefrshHandler;
