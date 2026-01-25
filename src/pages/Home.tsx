const Home = () => {
  return (
    <div className="mt-10">
      {/* Title */}
      <div className="flex flex-col gap-5 text-center">
        <div className="bg-linear-to-r from-[#837cfd] to-[#97f0f5] bg-clip-text">
          <h1 className="text-7xl font-bold font-[Prompt] text-transparent">บันทึกผลงาน</h1>
        </div>
        <h1 className="text-6xl font-bold text-white font-[Prompt]">
          Portfolio ของคุณ
        </h1>
      </div>
      {/*  */}

      <div className="text-center font-[Prompt] text-white text-2xl mt-9 max-w-230 mx-auto font-medium">
        <p className="text-transparent bg-linear-to-r from-[#c9c6fa] to-[#e2f9fa] bg-clip-text">
          เว็บไซต์สำหรับนักเรียนมัธยมปลาย ในการจัดเก็บผลงาน การแข่งขัน และกิจกรรมต่างๆ ป้องกันไฟล์รูปภาพหายและค้นหาได้ง่าย
        </p>
      </div>
    </div>
  );
};

export default Home;
