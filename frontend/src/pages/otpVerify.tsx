import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const OtpVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [registerData, setRegisterData] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 นาทีในวินาที (600 วินาที)
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลจาก localStorage
    const storedData = localStorage.getItem("registerData");
    if (storedData) {
      setRegisterData(JSON.parse(storedData));

      // เริ่ม countdown timer (10 นาที = 600 วินาที)
      const startTime = Date.now();
      const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 นาที

      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, OTP_EXPIRATION_TIME - elapsed);
        const secondsLeft = Math.floor(remaining / 1000);

        setTimeLeft(secondsLeft);

        if (secondsLeft === 0) {
          setIsExpired(true);
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }

          // แจ้งเตือนเมื่อ OTP หมดอายุ
          Swal.fire({
            icon: "warning",
            title: "OTP หมดอายุแล้ว",
            text: "รหัส OTP ของคุณหมดอายุแล้ว กรุณาสมัครสมาชิกใหม่",
            confirmButtonText: "กลับไปสมัครสมาชิก",
          }).then(() => {
            localStorage.removeItem("registerData");
            navigate("/register");
          });
        } else if (secondsLeft === 60) {
          // แจ้งเตือนเมื่อเหลือ 1 นาที
          Swal.fire({
            icon: "info",
            title: "OTP ใกล้หมดอายุ",
            text: "รหัส OTP ของคุณจะหมดอายุในอีก 1 นาที",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      }, 1000);
    } else {
      // ถ้าไม่มีข้อมูล ให้กลับไปหน้า register
      Swal.fire({
        icon: "warning",
        title: "ไม่พบข้อมูลการสมัครสมาชิก",
        text: "กรุณาสมัครสมาชิกใหม่",
      });
      navigate("/register");
    }

    // Cleanup interval เมื่อ component unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอก OTP",
        text: "OTP ต้องมี 6 หลัก",
      });
      return;
    }

    if (!registerData) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบข้อมูลการสมัครสมาชิก",
      });
      navigate("/register");
      return;
    }

    // ตรวจสอบว่า OTP หมดอายุหรือยัง (frontend check)
    if (isExpired) {
      Swal.fire({
        icon: "error",
        title: "OTP หมดอายุแล้ว",
        text: "รหัส OTP ของคุณหมดอายุแล้ว กรุณาสมัครสมาชิกใหม่",
        confirmButtonText: "กลับไปสมัครสมาชิก",
      }).then(() => {
        localStorage.removeItem("registerData");
        navigate("/register");
      });
      return;
    }

    // ตรวจสอบ OTP กับ backend (รวมถึง expiration)
    try {
      setLoading(true);

      await axios.post(`${API_URL}/verifyOTP`, {
        email: registerData.email,
        otp: otp,
      });

      // ถ้า OTP ถูกต้องและยังไม่หมดอายุ ให้ยิง API register
      const response = await axios.post(`${API_URL}/register`, {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });

      // หยุด countdown timer
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      // ลบข้อมูลออกจาก localStorage
      localStorage.removeItem("registerData");

      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: response.data.message || "สมัครสมาชิกสำเร็จ",
      });

      navigate("/login");
    } catch (err: any) {
      // Handle OTP verification errors
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "";

        // ตรวจสอบว่าเป็น error เกี่ยวกับ OTP หมดอายุหรือไม่
        if (
          errorMessage.includes("expired") ||
          errorMessage.includes("หมดอายุ")
        ) {
          setIsExpired(true);
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }
          Swal.fire({
            icon: "error",
            title: "OTP หมดอายุแล้ว",
            text: "รหัส OTP ของคุณหมดอายุแล้ว กรุณาสมัครสมาชิกใหม่",
            confirmButtonText: "กลับไปสมัครสมาชิก",
          }).then(() => {
            localStorage.removeItem("registerData");
            navigate("/register");
          });
        } else if (
          errorMessage.includes("OTP") ||
          errorMessage.includes("Invalid")
        ) {
          Swal.fire({
            icon: "error",
            title: "OTP ไม่ถูกต้อง",
            text: errorMessage,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถสมัครสมาชิกได้",
            text: errorMessage,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถสมัครสมาชิกได้",
          text: err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full mt-10 md:mt-0 md:items-center px-4 justify-center">
      <div
        className="relative w-full max-w-[600px] overflow-hidden p-0 font-[Prompt]
           md:rounded-3xl md:border md:border-white/10 md:bg-[rgba(30,41,59,0.7)] 
           md:p-8 md:shadow-[0_8px_32px_rgba(0,0,0,0.3)] md:backdrop-blur-[20px]"
      >
        <div className="mb-8 text-start md:text-center">
          <h2 className="text-4xl font-semibold text-slate-50">ยืนยัน OTP</h2>
          <p className="mt-2 text-slate-400">กรุณากรอก OTP ที่ได้รับจากอีเมล</p>
          {registerData && (
            <p className="mt-2 text-sm text-slate-500">
              ส่งไปที่: {registerData.email}
            </p>
          )}
          {!isExpired && (
            <div className="mt-4">
              <p className="text-sm text-slate-400">รหัส OTP จะหมดอายุในอีก</p>
              <p
                className={`text-lg font-semibold mt-1 ${
                  timeLeft <= 60 ? "text-red-500" : "text-[#6C63FF]"
                }`}
              >
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            </div>
          )}
          {isExpired && (
            <div className="mt-4">
              <p className="text-red-500 font-semibold">⚠️ OTP หมดอายุแล้ว</p>
            </div>
          )}
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              OTP Code
            </label>
            <input
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              type="text"
              placeholder="123456"
              maxLength={6}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none text-center text-2xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={isExpired || loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:hover:bg-[#393588] ${
              isExpired
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#6C63FF] hover:bg-[#5a52d5] cursor-pointer"
            }`}
          >
            {isExpired
              ? "OTP หมดอายุแล้ว"
              : loading
                ? "กำลังยืนยัน OTP..."
                : "ยืนยัน OTP"}
          </button>
        </form>

        <div className="mt-6 border-t gap-3 font-medium border-white/10 pt-6 text-center text-slate-400 flex justify-center">
          <p>ไม่ได้รับ OTP?</p>
          <p
            onClick={() => navigate("/register")}
            className="text-[#6C63FF] hover:underline cursor-pointer"
          >
            สมัครสมาชิกใหม่
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
