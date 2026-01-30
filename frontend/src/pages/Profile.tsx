import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Trophy, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err) {
        console.error("Authentication Error", err);
        handleLogout();
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="font-[Prompt]">
      {/* Title & Add Button */}
      <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-5">
        {/* Header & Count */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            Portfolio ของ {userData.username}
          </h2>
          <p className="text-purple-200 text-lg sm:text-xl md:text-2xl">
            ผลงานทั้งหมด ... รายการ
          </p>
        </div>

        {/* Add Button */}
        <div className="flex items-center">
          <button className="flex text-white gap-2 items-center font-bold text-lg sm:text-xl md:text-2xl rounded-2xl px-5 py-4 border border-white bg-linear-to-r from-[#6c63ff] to-[#00f2ff] cursor-pointer hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:bg-blue-800 transition-all duration-300">
            <Plus />
            เพิ่มผลงาน
          </button>
        </div>
      </div>

      {/* Portfolio */}
      <div>
        {/* Competition */}
        <div className="mt-13">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
              <Trophy className="text-white md:w-8 md:h-8 w-5 h-5" />
            </div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              การแข่งขัน
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
