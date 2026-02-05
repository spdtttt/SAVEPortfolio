import Swal from "sweetalert2";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const handleDelete = async (
  portfolio_id: number,
  setLoading: (value: boolean) => void,
  token: string | null
) => {
  // 🔔 Confirm ก่อนลบ
  const result = await Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบผลงานนี้จริงหรือไม่ ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });

  // ❌ ถ้าไม่กดยืนยัน
  if (!result.isConfirmed) return false;

  try {
    setLoading(true);

    await axios.delete(`${API_URL}/portfolios/${portfolio_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ ลบสำเร็จ
    await Swal.fire({
      title: "ลบสำเร็จ",
      text: "ผลงานถูกลบเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
    });

    window.location.reload();
    return true;
  } catch (err) {
    console.error(err);

    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "เกิดข้อผิดพลาดในการลบผลงาน",
      icon: "error",
      confirmButtonText: "ตกลง",
    });

    return false;
  } finally {
    setLoading(false);
  }
};

export default handleDelete;