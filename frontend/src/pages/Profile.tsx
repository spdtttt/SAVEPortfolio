import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddPage from "./AddPage";
import CompetitionPage from "../components/CompetitionPage";
import ProjectPage from "../components/ProjectPage";
import ActivityPage from "../components/ActivityPage";
import MobileMenu from "../components/MobileMenu";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
  });
  const [isAdd, setIsAdd] = useState(false);
  const [page, setPage] = useState("competition");
  const [portfolios, setPortfolios] = useState([]);

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

  useEffect(() => {
    axios
      .get(`${API_URL}/portfolios`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPortfolios(res.data);
      });
  }, [navigate, page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar
        userData={userData}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        page={page}
        setPage={setPage}
      />
      <MobileMenu
        page={page}
        setPage={setPage}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
      />

      {isAdd ? (
        <div className="font-[Prompt] pl-0 sm:pl-15 w-full pb-15">
          <AddPage />
        </div>
      ) : (
        <div className="font-[Prompt] pl-0 sm:pl-15 w-full pb-20">
          {page === "competition" && (
            <CompetitionPage isAdd={isAdd} setIsAdd={setIsAdd} portfolios={portfolios} />
          )}
          {page === "project" && (
            <ProjectPage isAdd={isAdd} setIsAdd={setIsAdd} portfolios={portfolios} />
          )}
          {page === "activity" && (
            <ActivityPage isAdd={isAdd} setIsAdd={setIsAdd} portfolios={portfolios} />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
