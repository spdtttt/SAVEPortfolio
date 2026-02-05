import { useEffect } from "react";

const Sidebar = ({
  userData,
  isAdd,
  setIsAdd,
  page,
  setPage,
}: {
  userData: any;
  isAdd: boolean;
  setIsAdd: any;
  page: string;
  setPage: (page: string) => void;
}) => {
  const menu = [
    {
      id: "competition",
      name: "การแข่งขัน",
      icon: "fas fa-trophy",
    },
    {
      id: "project",
      name: "ผลงาน",
      icon: "fas fa-file",
    },
    {
      id: "activity",
      name: "กิจกรรม",
      icon: "fas fa-bars",
    },
    {
      id: "add",
      name: "เพิ่ม",
      icon: "fas fa-plus-circle",
    },
  ];

  useEffect(() => {
    if (isAdd) {
      setPage("add");
    }
  }, [isAdd, page]);

  const handlePage = (id: string) => {
    if (id === "add") {
      setIsAdd(true);
    } else {
      setIsAdd(false);
      setPage(id);
    }
  };

  return (
    <aside className="bg-[#0f182b] font-[Prompt] min-h-screen w-76 hidden -ml-6 md:-ml-15 lg:-ml-20 xl:-ml-25 2xl:-ml-30 -mt-28 sm:-mt-32 md:-mt-36 pt-15 md:pt-20 border-r border-white/10 p-8 sm:flex flex-col">
      <div className="text-center mb-12 mt-10 flex flex-col gap-3">
        <div className="flex justify-center items-center w-[80px] h-[80px] bg-linear-to-br from-[#6c63ff] to-[#00f2ff] backdrop-blur-sm rounded-full mx-auto">
          <i className="fa-solid fa-user text-white text-3xl"></i>
        </div>
        <p className="text-white sm:text-lg md:text-xl font-medium">
          {userData.username}
        </p>
        <p className="text-[#94a3b8] sm:text-sm md:text-md font-normal">
          {userData.email}
        </p>
      </div>
      <ul className="text-[#94a3b8] text-lg gap-2 flex flex-col">
        {menu.map((item, index) => (
          <li
            key={index}
            onClick={() => handlePage(item.id)}
            className={`px-4 py-3 flex gap-2.5 items-center transition-all ease-in-out duration-300 rounded-xl cursor-pointer ${
              page === item.id
                ? "bg-[rgba(108,99,255,0.1)] text-[#6c63ff]"
                : "hover:bg-[rgba(108,99,255,0.1)] hover:text-[#6c63ff]"
            }`}
          >
            <i className={item.icon}></i>
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
