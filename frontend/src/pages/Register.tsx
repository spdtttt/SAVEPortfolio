import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถสมัครสมาชิกได้",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถสมัครสมาชิกได้",
        text: "รหัสผ่านไม่ตรงกัน",
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', formData);
      setMessage(response.data.message);
      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: response.data.message,
      });
      
      navigate('/login');
    } catch(err: any) {
      setMessage(err.response.data.message);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถสมัครสมาชิกได้",
        text: err.response.data.message,
      });
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
          <h2 className="text-4xl font-semibold text-slate-50">สร้างบัญชี</h2>
          <p className="mt-2 text-slate-400">
            เริ่มต้นใช้งานเว็บไซต์จัดเก็บผลงานของคุณ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Username
            </label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              type="text"
              placeholder="Suppapon"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Email Address
            </label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              placeholder="Create a password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Confirm Password
            </label>
            <input
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              type="password"
              placeholder="Confirm a password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6C63FF] py-3 font-semibold text-white
               transition hover:bg-[#5a52d5] cursor-pointer"
          >
            สร้างบัญชี
          </button>
        </form>

        <div className="mt-6 border-t gap-3 font-medium border-white/10 pt-6 text-center text-slate-400 flex justify-center">
          <p>มีบัญชีอยู่แล้ว?</p>
          <p
            onClick={() => navigate("/login")}
            className="text-[#6C63FF] hover:underline cursor-pointer"
          >
            เข้าสู่ระบบ
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
