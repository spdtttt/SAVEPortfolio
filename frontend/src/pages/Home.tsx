import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="mt-10">
      {/* Title */}
      <div className="flex flex-col gap-5 text-center">
        <div className="bg-linear-to-r from-[#837cfd] to-[#97f0f5] bg-clip-text">
          <h1 className="text-7xl font-bold font-[Prompt] text-transparent">
            บันทึกผลงาน
          </h1>
        </div>
        <h1 className="text-6xl font-bold text-white font-[Prompt]">
          Portfolio ของคุณ
        </h1>
      </div>
      {/*  */}

      {/* Title & Description */}
      <div className="text-center font-[Prompt] min-h-18 text-white text-2xl mt-9 max-w-230 mx-auto font-medium">
        <p className="text-transparent bg-linear-to-r from-[#c9c6fa] to-[#e2f9fa] bg-clip-text">
          <TypeAnimation
            sequence={[
              "เว็บไซต์สำหรับนักเรียนมัธยมปลาย ในการจัดเก็บผลงาน การแข่งขัน และกิจกรรมต่างๆ ป้องกันไฟล์รูปภาพหายและค้นหาได้ง่าย",
              1500,
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            style={{ display: "inline-block" }}
            repeat={Infinity}
          />
        </p>
      </div>
      {/*  */}

      {/* Button */}
      <div className="flex justify-center mt-15 font-[Prompt] text-white font-bold text-2xl">
        <button
          onClick={() =>
            isLoggedIn ? navigate("/profile") : navigate("/login")
          }
          className="  flex items-center gap-2 px-10 py-4 bg-linear-to-r from-[#6c63ff] to-[#00f2ff] text-white hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-2xl cursor-pointer transition-all duration-300"
        >
          เริ่มต้นใช้งาน
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Home;
