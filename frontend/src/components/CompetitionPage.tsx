import { Plus } from "lucide-react";
import { useState } from "react";
import DetailModal from "./DetailModal";
import PDFThumbnail from "./PDFThumbnail";
import { BarLoader } from "react-spinners";
import handleDelete from "../../function/handleDelete";
import { formatThaiDate } from "../utils/formatThaiDate";

const API_URL = import.meta.env.VITE_API_URL;

const CompetitionPage = ({
  isAdd,
  setIsAdd,
  portfolios,
}: {
  isAdd: boolean;
  setIsAdd: (isAdd: boolean) => void;
  portfolios: any[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const competitionPortfolios = portfolios.filter(
    (portfolio) => portfolio.type === "competition",
  );

  const handleDownloadAll = async (files: string[]) => {
    for (const file of files) {
      const response = await fetch(`${API_URL}/uploads/${file}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
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
      {/* Header */}
      <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-5 mb-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            การแข่งขัน (Competition)
          </h2>
          <p className="text-purple-200 text-lg sm:text-xl md:text-2xl">
            ทั้งหมด {competitionPortfolios.length} รายการ
          </p>
        </div>

        <div className="md:self-end">
          <button
            onClick={() => setIsAdd(true)}
            className="flex hover:-translate-y-1 bg-linear-to-br shadow-[0_4px_15px_rgba(108,99,255,0.3)] hover:shadow-[0_10px_30px_rgba(108,99,255,0.5)] transition-all ease-in duration-200 from-[#6c63ff] to-[#5a52d5] py-2 px-5 rounded-xl gap-2 items-center text-white font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Portfolio Grid */}
      {competitionPortfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {competitionPortfolios.map((portfolio, index) => {
            const firstFile = portfolio.files?.[0];
            if (!firstFile) return null;

            const fileUrl = `${API_URL}/uploads/${firstFile}`;
            const isPDF = firstFile.toLowerCase().endsWith(".pdf");

            return (
              <div
                key={portfolio.id || index}
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedPortfolio(portfolio);
                }}
                className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[16px] overflow-hidden transition-all duration-200 ease-in hover:border-[#6c63ff] flex flex-col h-full"
              >
                {/* Thumbnail */}
                {isPDF ? (
                  <div className="w-full h-full md:h-[200px] object-cover">
                    <PDFThumbnail url={fileUrl} />
                  </div>
                ) : (
                  <img
                    src={fileUrl}
                    alt={portfolio.title}
                    className="w-full h-full md:h-[200px] object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Badge */}
                  <div className="flex justify-between">
                    <span
                      className={`w-fit py-1.5 px-3 rounded-[20px] text-[0.85rem] font-semibold border
                    ${
                      portfolio.level === "international"
                        ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                        : portfolio.level === "national"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : portfolio.level === "regional"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : portfolio.level === "province" ||
                                portfolio.level === "district"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                    >
                      {portfolio.level === "international"
                        ? "นานาชาติ"
                        : portfolio.level === "national"
                          ? "ระดับชาติ"
                          : portfolio.level === "regional"
                            ? "ระดับภูมิภาค"
                            : portfolio.level === "province" ||
                                portfolio.level === "district"
                              ? "ระดับจังหวัด/เขตพื้นที่"
                              : "ระดับโรงเรียน"}
                    </span>

                    <div
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleDelete(portfolio.id, setLoading, token);
                      }}
                      className="text-white hover:scale-108 hover:rotate-12 cursor-pointer bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out items-center justify-center flex px-2 rounded-xl"
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-[1.25rem] font-bold text-white">
                    {portfolio.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-[1rem] line-clamp-2 text-[#94a3b8] mb-2">
                    {portfolio.description}
                  </p>

                  {/* Footer (อยู่ล่างสุดเสมอ) */}
                  <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/10">
                    <span className="text-[0.8rem] text-[#94a3b8]">
                      {formatThaiDate(portfolio.startDate)} -{" "}
                      {formatThaiDate(portfolio.endDate)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAll(portfolio.files);
                      }}
                      className="bg-transparent border-2 border-white/10 hover:border-[#6c63ff] hover:text-[#6c63ff] text-[#f8fafc] inline-flex items-center gap-2 py-[0.4rem] px-[0.8rem] rounded-[12px] font-semibold cursor-pointer text-[0.8rem] transition-all duration-300"
                    >
                      <i className="fas fa-download"></i>
                      ดาวน์โหลด
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-400">ยังไม่มีผลงานการแข่งขัน</p>
      )}

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portfolio={selectedPortfolio}
      />
    </>
  );
};

export default CompetitionPage;
