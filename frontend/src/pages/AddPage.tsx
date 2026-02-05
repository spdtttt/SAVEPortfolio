import Select from "react-select";
import { useState } from "react";
import { Save } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { BarLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL;

const typeOptions = [
  { value: "competition", label: "การแข่งขัน" },
  { value: "project", label: "ผลงาน/โครงงาน" },
  { value: "activity", label: "กิจกรรม" },
];

const levelOptions = [
  { value: "international", label: "ระดับนานาชาติ" },
  { value: "national", label: "ระดับชาติ" },
  { value: "regional", label: "ระดับภูมิภาค" },
  { value: "province", label: "ระดับจังหวัด" },
  { value: "district", label: "ระดับเขตพื้นที่การศึกษา" },
  { value: "school", label: "ระดับโรงเรียน" },
];

const glassSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    minHeight: "44px",
    paddingLeft: "8px",
    paddingRight: "8px",
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(108,99,255,0.4)"
      : "0 10px 15px -3px rgba(0,0,0,0.05)",
    outline: "none",
    fontWeight: 400,
    color: "white",
    transition: "all 0.2s ease",
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: "0 10px",
  }),

  input: (base: any) => ({
    ...base,
    color: "white",
    fontSize: "1rem", // text-md
  }),

  singleValue: (base: any) => ({
    ...base,
    color: "white",
    fontSize: "1rem",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "1rem",
  }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: "#0f182b",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    marginTop: "6px",
  }),

  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(108,99,255,0.15)" : "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: "0.95rem",
  }),
};

const AddPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<any>(null);
  const [level, setLevel] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleReset = () => {
    setTitle("");
    setType(null);
    setLevel(null);
    setDescription("");
    setFiles([]);
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type?.value || "");
    formData.append("level", level?.value || "");
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "สำเร็จ",
        text: "เพิ่มผลงานใหม่เรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      handleReset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการเพิ่มผลงานใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BarLoader height={6} width={200} color="white" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-start flex-col gap-0 md:gap-5 pb-3 md:pb-15">
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            เพิ่มผลงานใหม่ (Add New Work)
          </h2>
        </div>

        {/* Form */}
        <div className="p-4 md:bg-[rgba(30,41,59,0.7)] md:backdrop-blur-[20px] md:border md:border-white/10 md:rounded-[24px] md:p-8 md:shadow-lg md:shadow-black/10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-white text-md font-medium"
                >
                  ชื่อผลงาน (Title)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Young iOS Developer Hackathon 2025 ระดับประเทศ"
                  className="bg-[rgba(255,255,255,0.05)] focus:outline-none font-normal text-white text-md border border-white/10 rounded-[12px] py-2.5 px-4 shadow-lg shadow-black/5"
                />
              </div>

              <div className="flex gap-7 md:gap-20">
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="type"
                    className="text-white text-md font-medium"
                  >
                    ประเภทของผลงาน (Type)
                  </label>
                  <Select
                    placeholder="เลือกประเภทของผลงาน"
                    id="type"
                    options={typeOptions}
                    value={type}
                    onChange={(selected) => setType(selected)}
                    styles={glassSelectStyles}
                  />
                </div>

                {type?.value === "competition" && (
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="level"
                      className="text-white text-md font-medium"
                    >
                      ระดับการแข่งขัน (Level)
                    </label>
                    <Select
                      id="level"
                      placeholder="เลือกระดับการแข่งขัน"
                      options={levelOptions}
                      value={level}
                      onChange={(selected) => setLevel(selected)}
                      styles={glassSelectStyles}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-white text-md font-medium"
                >
                  คำอธิบาย (Description)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายเกี่ยวกับผลงานของคุณ"
                  className="bg-[rgba(255,255,255,0.05)] focus:outline-none font-normal text-white text-md border border-white/10 rounded-[12px] py-2.5 px-4 shadow-lg shadow-black/5"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="description"
                    className="text-white text-md font-medium"
                  >
                    วันที่เริ่มต้น (Start Date)
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-white bg-[rgba(255,255,255,0.05)] focus:outline-none font-normal text-white text-md border border-white/10 rounded-[12px] py-2.5 px-4 shadow-lg shadow-black/5"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="endDate"
                    className="text-white text-md font-medium"
                  >
                    วันที่สิ้นสุด (End Date)
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-white bg-[rgba(255,255,255,0.05)] focus:outline-none font-normal text-white text-md border border-white/10 rounded-[12px] py-2.5 px-4 shadow-lg shadow-black/5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="description"
                    className="text-white text-md font-medium"
                  >
                    อัปโหลดไฟล์ (File Upload)
                  </label>

                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="text-white mr-2 hover:underline cursor-pointer transition duration-300"
                  >
                    ล้าง
                  </button>
                </div>
                <label
                  htmlFor="file"
                  className="inline-flex items-center gap-2 cursor-pointer  
                bg-[rgba(255,255,255,0.05)]
                border border-white/10
                rounded-[12px]
                py-2.5 px-4
                text-white
                shadow-lg shadow-black/5
                hover:bg-white/10
                transition"
                >
                  <i className="fa-solid fa-upload"></i>
                  เลือกไฟล์
                </label>

                <input
                  type="file"
                  id="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5"
                      >
                        📄 {file.name}
                        <span className="ml-auto text-xs text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="disabled:cursor-not-allowed flex hover:-translate-y-0.5 bg-linear-to-br shadow-[0_4px_15px_rgba(108,99,255,0.3)] hover:shadow-[0_10px_30px_rgba(108,99,255,0.5)] hover: transition-all ease-in duration-200 from-[#6c63ff] to-[#5a52d5] py-2 px-5 rounded-xl gap-2 items-center text-white font-medium sm:text-md md:text-lg cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPage;
