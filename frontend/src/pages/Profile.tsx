import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddPage from "../components/AddPage";
import CompetitionPage from "../components/CompetitionPage";
import ProjectPage from "../components/ProjectPage";
import ActivityPage from "../components/ActivityPage";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [isAdd, setIsAdd] = useState(false);
  const [page, setPage] = useState('competition');

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
    <div className="flex">
      <Sidebar userData={userData} isAdd={isAdd} setIsAdd={setIsAdd} page={page} setPage={setPage} />

      {isAdd ? (
        <AddPage isAdd={isAdd} setIsAdd={setIsAdd} />
      ) : (
        <div className="font-[Prompt] pl-0 sm:pl-15 w-full">
          {page === 'competition' && <CompetitionPage isAdd={isAdd} setIsAdd={setIsAdd} />}
          {page === 'project' && <ProjectPage isAdd={isAdd} setIsAdd={setIsAdd} />}
          {page === 'activity' && <ActivityPage isAdd={isAdd} setIsAdd={setIsAdd} />}
        </div>
      )}
    </div>
  );
};

export default Profile;
