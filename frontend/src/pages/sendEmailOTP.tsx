import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SendEmailOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกอีเมล",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sendOTP-recovery`, {
        email: email,
      });

      localStorage.setItem("recoveryData", email);

      Swal.fire({
        icon: "success",
        title: "ส่ง OTP สำเร็จ",
        text: "กรุณาตรวจสอบอีเมลของคุณ",
      });
      navigate("/send-email-otp/otp-verify-recovery");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full items-center justify-center px-4">
      <div
        className="relative w-full max-w-[450px] overflow-hidden rounded-3xl border border-white/10
           bg-[rgba(30,41,59,0.7)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]
           backdrop-blur-[20px] font-[Prompt]"
      >
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-semibold text-slate-50">
            กู้คืนรหัสผ่าน
          </h2>
          <p className="mt-2 text-slate-400">
            กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์หรือตัวเลขยืนยัน (OTP)
            สำหรับรีเซ็ตรหัสผ่านของคุณ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6C63FF] py-3 font-semibold text-white cursor-pointer
               transition hover:bg-[#5a52d5] disabled:cursor-not-allowed disabled:hover:bg-[#393588]"
          >
            {loading ? "กำลังส่ง..." : "ส่ง OTP ไปที่อีเมล"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <p>
            หากไม่พบอีเมลในกล่องเข้า ลองตรวจสอบในโฟลเดอร์{" "}
            <span className="font-semibold">Spam / Junk</span> หรือ{" "}
            <span className="font-semibold">Promotions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendEmailOTP;
