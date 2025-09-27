import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

interface LoginInfo {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  jwtToken?: string;
  name?: string;
  error?: {
    details: Array<{ message: string }>;
  };
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
    console.log(name, value);
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
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
