import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const TopBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
    setIsLoggedIn(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1a2e] border-b border-white/10">
      <div className="max-w-[1700px] mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#6c63ff] to-[#00f2ff]">
            <i className="fas fa-layer-group"></i>
            SAVEPortfolio
          </h1>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center space-x-5">
          {!isLoggedIn && (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className="px-5 md:px-6 py-2.5 text-white bg-[#0f182c] hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-full border-2 border-gray-700 cursor-pointer transition-all duration-300"
                style={{ fontFamily: "Prompt, sans-serif" }}
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => handleNavigate("/register")}
                className="px-5 md:px-6 py-2.5 text-black bg-white hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-full cursor-pointer transition-all duration-300"
                style={{ fontFamily: "Prompt, sans-serif" }}
              >
                สมัครสมาชิก
              </button>
            </>
          )}

          {isLoggedIn && (
            <div className="flex items-center space-x-4 md:space-x-6">
              <span
                className="text-white/90 text-sm md:text-lg"
                style={{ fontFamily: "Prompt, sans-serif" }}
              >
                <i className="fa-solid fa-user"></i> {message}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 md:px-5 py-2 cursor-pointer bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all text-sm md:text-base"
                style={{ fontFamily: "Prompt, sans-serif" }}
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <i
            className={isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}
          ></i>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0f1a2e] backdrop-blur-md">
          <div className="px-4 py-5 flex flex-col gap-3">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-full px-4 py-2.5 text-white bg-[#0f182c] font-medium rounded-full border border-gray-700 cursor-pointer transition-all duration-200"
                  style={{ fontFamily: "Prompt, sans-serif" }}
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => handleNavigate("/register")}
                  className="w-full px-4 py-2.5 text-black bg-white font-medium rounded-full cursor-pointer transition-all duration-200"
                  style={{ fontFamily: "Prompt, sans-serif" }}
                >
                  สมัครสมาชิก
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                <div className="flex items-center justify-between text-white/90 text-sm">
                  <span style={{ fontFamily: "Prompt, sans-serif" }}>
                    <i className="fa-solid fa-user"></i> {message}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 cursor-pointer bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all text-sm"
                  style={{ fontFamily: "Prompt, sans-serif" }}
                >
                  ออกจากระบบ
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopBar;
