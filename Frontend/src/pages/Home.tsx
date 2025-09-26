
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

interface Product {
  name: string;
  price: number;
}

function Home() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>("");
  const [products, setProducts] = useState<Product[] | null>(null);
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

  const fetchProducts = async () => {
    try {
      const url = "https://deploy-mern-app-1-api.vercel.app/products";
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      };
      const response = await fetch(url, headers);
      const result: Product[] = await response.json();
      console.log(result);
      setProducts(result);
    } catch (err) {
      handleError(err as Error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome
        {loggedInUser}
      </h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {products &&
          products.map((item, index) => (
            <ul key={index}>
              <span>
                {item.name} : {item.price}
              </span>
            </ul>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;