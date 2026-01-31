import { Plus } from "lucide-react";

const CompetitionPage = ({ isAdd, setIsAdd }: { isAdd: boolean; setIsAdd: (isAdd: boolean) => void; }) => {
  return (
    <>
      {/* Title & Add Button */}
      <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-5">
        {/* Header & Count */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            การแข่งขัน (Competition)
          </h2>
          <p className="text-purple-200 text-lg sm:text-xl md:text-2xl">
            ทั้งหมด ... รายการ
          </p>
        </div>

        {/* Add Button */}
        <div className="md:self-end">
          <button
            onClick={() => setIsAdd(true)}
            className="flex hover:-translate-y-1 bg-linear-to-br shadow-[0_4px_15px_rgba(108,99,255,0.3)] hover:shadow-[0_10px_30px_rgba(108,99,255,0.5)] hover: transition-all ease-in duration-200 from-[#6c63ff] to-[#5a52d5] py-2 px-5 rounded-xl gap-2 items-center text-white font-medium sm:text-md md:text-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>
    </>
  );
};

export default CompetitionPage;
