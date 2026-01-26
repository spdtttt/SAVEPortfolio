import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: `ยินดีต้อนรับคุณ ${response.data.username}`,
      })
      navigate('/profile')
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: error.response.data.message,
      })
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6C63FF] py-3 font-semibold text-white cursor-pointer
               transition hover:bg-[#5a52d5]"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 border-t gap-3 font-medium border-white/10 pt-6 text-center text-slate-400 flex justify-center">
          <p>ยังไม่มีบัญชี?</p>
          <p
            onClick={() => navigate("/register")}
            className="text-[#6C63FF] hover:underline cursor-pointer"
          >
            สมัครสมาชิก
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
