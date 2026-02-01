const MobileMenu = ({
  page,
  setPage,
  isAdd,
  setIsAdd,
}: {
  page: string;
  setPage: (page: string) => void;
  isAdd: boolean;
  setIsAdd: (v: boolean) => void;
}) => {
  const menu = [
    {
      id: "competition",
      name: "แข่งขัน",
      icon: "fas fa-th-large",
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

  const handlePage = (id: string) => {
    if (id === "add") {
      setIsAdd(true);
      setPage("add");
    } else {
      setIsAdd(false);
      setPage(id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f182b] border-t border-white/10 sm:hidden font-[Prompt]">
      <ul className="flex justify-around items-center py-3">
        {menu.map((item) => (
          <li
            key={item.id}
            onClick={() => handlePage(item.id)}
            className={`flex flex-col items-center gap-1 text-xs cursor-pointer transition-all duration-300 ${
              page === item.id
                ? "text-[#6c63ff]"
                : "text-[#94a3b8]"
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileMenu;
