import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { motion } from "framer-motion";

interface LoginInfo {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {
      const url = `http://localhost:8080/api/v1/user/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, msg, token, user } = result;

      if (success) {
        handleSuccess(msg);
        localStorage.setItem("token", token || "");
        localStorage.setItem("loggedInUser", user?.username || "");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        handleError(msg || "An error occurred");
      }
    } catch (err) {
      handleError(err as Error);
    }
  };

  return (

    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        {/* Floating Label Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            required
            placeholder=" "
            className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-sm focus:border-purple-500 focus:outline-none"
          />
          <label
            className="absolute left-0 -top-2.5 text-gray-500 text-xs transition-all
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
              peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-500"
          >
            Email
          </label>
        </div>

        {/* Floating Label Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            required
            placeholder=" "
            className="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-sm focus:border-purple-500 focus:outline-none"
          />
          <label
            className="absolute left-0 -top-2.5 text-gray-500 text-xs transition-all
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
              peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-500"
          >
            Password
          </label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-1 top-1 text-gray-500 hover:text-purple-500 transition"
          >
            {showPassword ? "👁️" : "🔒"}
          </button>
        </div>

        {/* Animated Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
        >
          <span className="relative z-10">Login</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.button>

        <span className="text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Signup
          </Link>
        </span>
      </form>
      <ToastContainer />
    </motion.div>

    <div className="w-full h-full flex justify-center items-center">
      <div className="container">
        <h1>Login </h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {showPassword ? (
                <span role="img" aria-label="hide password">
                  👁️
                </span>
              ) : (
                <span role="img" aria-label="show password">
                  🔒
                </span>
              )}
            </button>
          </div>
          <button type="submit" className="bg-blue-600">
            Login
          </button>
          <span>
            Does't have an account ?<Link to="/signup">Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>

  );
};

export default Login;
