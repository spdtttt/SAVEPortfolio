import {
  ChevronRight,
  Trophy,
  Briefcase,
  Zap,
  Clock,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { motion } from "motion/react";

const Features = () => {
  return (
    <div className="font-[Prompt] pb-10 text-white flex flex-col items-center text-center justify-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-10"
      >
        ทำไมต้อง SAVEPortfolio ?
      </motion.div>

      {/* Section */}
      <div className="flex flex-col gap-8 w-full">
        {[
          {
            icon: <Trophy className="w-10 h-10" />,
            title: "บันทึกการแข่งขัน",
            desc: "เก็บรางวัลและเกียรติบัตรจากการแข่งขันทุกระดับ",
            color: "from-yellow-400 to-orange-500",
          },
          {
            icon: <Briefcase className="w-10 h-10" />,
            title: "จัดเก็บผลงาน",
            desc: "รวบรวมโครงงานและผลงานที่ภาคภูมิใจ",
            color: "from-pink-400 to-purple-500",
          },
          {
            icon: <Zap className="w-10 h-10" />,
            title: "บันทึกกิจกรรม",
            desc: "เก็บภาพและความทรงจำจากกิจกรรมต่างๆ",
            color: "from-cyan-400 to-blue-500",
          },
          {
            icon: <Clock className="w-10 h-10" />,
            title: "ค้นหาง่าย",
            desc: "ค้นหาผลงานที่ต้องการได้อย่างรวดเร็ว",
            color: "from-violet-400 to-purple-500",
          },
          {
            icon: <Calendar className="w-10 h-10" />,
            title: "จัดระเบียบ",
            desc: "จัดเรียงตามประเภทและวันที่อย่างเป็นระบบ",
            color: "from-rose-400 to-pink-500",
          },
        ].map((feature, idx) => (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            key={idx}
          >
            <div className="flex items-center gap-10 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl md:p-8 p-5 hover:bg-white/10 transition-all duration-300 hover:scale-102 hover:shadow-2xl">
              <div
                className={`w-15 h-15 md:w-23 md:h-23 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <div className="text-start">
                <h3
                  className="text-xl md:text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "Prompt, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-purple-200 leading-relaxed md:text-xl"
                  style={{ fontFamily: "Prompt, sans-serif" }}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {/* Title */}
      <div className="flex flex-col gap-5 text-center">
        <div className="bg-linear-to-r from-[#837cfd] to-[#97f0f5] bg-clip-text">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-[Prompt] text-transparent">
            บันทึกผลงาน
          </h1>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white font-[Prompt]">
          Portfolio ของคุณ
        </h1>
      </div>
      {/*  */}

      {/* Description */}
      <div className="text-center font-[Prompt] min-h-18 text-white text-xl sm:text-2xl mt-9 max-w-230 mx-auto font-medium">
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
      <div className="flex justify-center mt-8 sm:mt-10 md:mt-15 mb-20 sm:mb-30 md:mb-35 font-[Prompt] text-white font-bold text-2xl">
        <button
          onClick={() =>
            isLoggedIn ? navigate("/profile") : navigate("/login")
          }
          className="group flex items-center gap-2 px-10 py-4 bg-linear-to-r from-[#6c63ff] to-[#00f2ff] text-white hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] font-medium rounded-2xl cursor-pointer transition-all duration-300"
        >
          เริ่มต้นใช้งาน
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      <Features />
    </div>
  );
};

export default Home;
