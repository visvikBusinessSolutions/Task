import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import ProjectDashboard from "../components/project";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
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
        <button onClick={handleLogout} className="bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-200" >Logout</button>
      </div>

      <div>
        <ProjectDashboard />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
