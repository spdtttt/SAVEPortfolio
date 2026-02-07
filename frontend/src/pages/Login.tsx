import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // เช็คว่ามี token หรือยัง ถ้ามีแล้วให้ไปหน้า profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: `ยินดีต้อนรับคุณ ${response.data.username}`,
      });

      setEmail("");
      setPassword("");
      navigate("/profile");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential!);

      const response = await axios.post(`${API_URL}/google-login`, {
        email: decoded.email,
        name: decoded.name,
        provider_id: decoded.sub,
      });

      localStorage.setItem("token", response.data.token);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: `ยินดีต้อนรับคุณ ${response.data.username}`,
      });

      navigate("/profile");
    } catch (err) {
      console.error("Fail to Sign In with Google:", err);
      Swal.fire({
        icon: "error",
        title: "Google Login ล้มเหลว",
        text: "ไม่สามารถเข้าสู่ระบบด้วย Google ได้",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full mt-10 md:mt-0 md:items-center justify-center px-4">
      <div
        className="relative w-full max-w-[600px] overflow-hidden p-0 font-[Prompt]
           md:rounded-3xl md:border md:border-white/10 md:bg-[rgba(30,41,59,0.7)] 
           md:p-8 md:shadow-[0_8px_32px_rgba(0,0,0,0.3)] md:backdrop-blur-[20px]"
      >
        <div className="mb-8 text-start md:text-center">
          <h2 className="text-4xl font-semibold text-slate-50">ยินดีต้อนรับ</h2>
          <p className="mt-2 text-slate-400">
            กรอกข้อมูลของคุณเพื่อเข้าสู่ระบบและใช้งาน
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

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div
            onClick={() => navigate("/send-email-otp")}
            className="text-white font-medium cursor-pointer hover:underline -mt-2 flex justify-end"
          >
            ลืมรหัสผ่าน?
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6C63FF] py-3 font-semibold text-white cursor-pointer
               transition hover:bg-[#5a52d5] disabled:cursor-not-allowed disabled:hover:bg-[#393588]"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 border-t mb-4 gap-3 font-medium border-white/10 pt-6 text-center text-slate-400 flex justify-center">
          <p>ยังไม่มีบัญชี?</p>
          <p
            onClick={() => navigate("/register")}
            className="text-[#6C63FF] hover:underline cursor-pointer"
          >
            สมัครสมาชิก
          </p>
        </div>
        <div className="flex justify-center items-center">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
