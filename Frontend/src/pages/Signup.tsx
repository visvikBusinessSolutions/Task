import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { motion } from "framer-motion";

interface SignupInfo {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("name, email and password are required");
    }
    try {
      const url = `http://localhost:8080/api/v1/user/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });

      const result = await response.json();
      const { success, msg } = result;

      if (success) {
        handleSuccess(msg);
        setTimeout(() => navigate("/login"), 1000);
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
      <h1 className="text-2xl font-bold text-center">Signup</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-6">
        {/* Floating Label Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={signupInfo.name}
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
            Name
          </label>
        </div>

        {/* Floating Label Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={signupInfo.email}
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

        {/* Floating Label Password + Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={signupInfo.password}
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

        {/* Animated Gradient Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
        >
          <span className="relative z-10">Signup</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.button>

        <span className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </span>
      </form>
      <ToastContainer />
    </motion.div>
  );
};

export default Signup;
