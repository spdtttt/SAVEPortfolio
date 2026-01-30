import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface LocationState {
  resetToken?: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetToken = state.resetToken;

  useEffect(() => {
    if (!resetToken) {
      Swal.fire({
        icon: "error",
        title: "ไม่อนุญาต",
        text: "ไม่พบสิทธิ์ในการรีเซ็ตรหัสผ่าน กรุณากรอกอีเมลและยืนยัน OTP ใหม่อีกครั้ง",
      }).then(() => {
        navigate("/send-email-otp");
      });
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resetToken) return;

    if (!newPassword || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านสั้นเกินไป",
        text: "รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านใหม่และยืนยันให้ตรงกัน",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        token: resetToken,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "รีเซ็ตรหัสผ่านสำเร็จ",
        text: "กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ",
      }).then(() => {
        navigate("/login");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถรีเซ็ตรหัสผ่านได้",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด",
      });
    } finally {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
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
            ตั้งรหัสผ่านใหม่
          </h2>
          <p className="mt-2 text-slate-400">
            กรุณากำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              required
              placeholder="รหัสผ่านใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              required
              placeholder="ยืนยันรหัสผ่านใหม่"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !resetToken}
            className="w-full rounded-xl bg-[#6C63FF] py-3 font-semibold text-white cursor-pointer
               transition hover:bg-[#5a52d5] disabled:cursor-not-allowed disabled:hover:bg-[#393588]"
          >
            {loading ? "กำลังบันทึกรหัสผ่าน..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
