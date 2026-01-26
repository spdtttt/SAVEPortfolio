import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const TopBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchProfileData = async () => {
        try {
          const response = await axios.get("http://localhost:3001/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessage(response.data.username);
        } catch (err) {
          console.error("Authentication Error", err);
          handleLogout();
        }
      };

      fetchProfileData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1a2e] border-b border-white/10  ">
      <div className="max-w-[1700px] mx-auto px-6 py-5 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center space-x-2">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#6c63ff] to-[#00f2ff]">
              <i className="fas fa-layer-group"></i>
              SAVEPortfolio
            </h1>
          </div>
        </div>
        {!isLoggedIn && (
          <div className="flex space-x-5">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-white bg-[#0f182c] hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-full border-2 border-gray-700 cursor-pointer transition-all duration-300"
              style={{ fontFamily: "Prompt, sans-serif" }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 text-black bg-white hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-full cursor-pointer transition-all duration-300"
              style={{ fontFamily: "Prompt, sans-serif" }}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}
        {isLoggedIn && (
          <div className="flex items-center space-x-6">
            <span
              className="text-white/90 text-lg"
              style={{ fontFamily: "Prompt, sans-serif" }}
            >
              <i className="fa-solid fa-user"></i> {message}
            </span>
            <button
              onClick={() => {
                handleLogout();
              }}
              className="px-5 py-2 cursor-pointer bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all"
              style={{ fontFamily: "Prompt, sans-serif" }}
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
