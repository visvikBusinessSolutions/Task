// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { handleSuccess } from "../utils";
// import { ToastContainer } from "react-toastify";
// import ProjectDashboard from "../components/project";

// function Home() {
//   const [loggedInUser, setLoggedInUser] = useState<string | null>("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoggedInUser(localStorage.getItem("loggedInUser"));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("loggedInUser");
//     handleSuccess("User Loggedout");
//     setTimeout(() => {
//       navigate("/login");
//     }, 1000);
//   };

//   return (
//     <div className="full">
//       <div className="full">
//         <div className="flex justify-between items-center md:mx-auto md:p-6 shadow-xl border-gray rounded-xl bg-[#F2F2F2]/60">
//           <h1 className="md:text-4xl text-2xl">Welcome {loggedInUser}</h1>
//           <button onClick={handleLogout} className="bg-blue-900">
//             Logout
//           </button>
//         </div>

//         <div>
//           <ProjectDashboard />
//         </div>
//         <ToastContainer />
//       </div>
//       <div className="min-h-screen bg-gray-50 pb-10">
//         {" "}
//         {/* Added min-h-screen and light gray background */}
//         <header className="flex justify-between items-center px-4 py-4 md:px-10 shadow-lg bg-indigo-700/80 text-white">
//           <h1 className="md:text-4xl text-2xl font-semibold tracking-wider">
//             Welcome <span className="font-light">{loggedInUser}</span>
//           </h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500/80 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
//           >
//             Logout
//           </button>
//         </header>
//         <div className="md:max-w-7xl md:mx-auto pt-6 px-4">
//           {" "}
//           {/* Center the content */}
//           <ProjectDashboard />
//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }

// export default Home;




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
        <button
          onClick={handleLogout}
          className="bg-purple-500 text-white p-2 rounded-lg font-semibold hover:bg-purple-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      <div>
        <ProjectDashboard />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;