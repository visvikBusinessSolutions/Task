import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import ProjectDashboard from "../component/project";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Loggedout");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  
  return (
    <div className="full">
      <div className="flex justify-between items-center md:mx-auto md:p-6">
        <h1 className="md:text-4xl text-2xl">Welcome {loggedInUser}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <ProjectDashboard />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
