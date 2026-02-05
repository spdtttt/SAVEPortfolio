import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PDFThumbnail from "./PDFThumbnail";

const API_URL = import.meta.env.VITE_API_URL;

const DetailModal = ({
  isOpen,
  onClose,
  portfolio,
}: {
  isOpen: boolean;
  onClose: () => void;
  portfolio: any;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !portfolio) return null;

  const files = portfolio.files || [];
  const totalFiles = files.length;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? totalFiles - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === totalFiles - 1 ? 0 : prev + 1));
  };

  const handleDownloadAll = async () => {
    if (!portfolio.files?.length) return;

    for (const file of portfolio.files) {
      const res = await fetch(`${API_URL}/uploads/${file}`);
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await new Promise((r) => setTimeout(r, 300));
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.9)] backdrop-blur-sm px-3 sm:px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-6xl
          max-h-[95vh]
          overflow-y-auto
          rounded-2xl
          bg-[rgba(30,41,59,0.95)]
          border border-white/10
          shadow-2xl
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-10 h-10
            rounded-full
            bg-black/50
            text-white
            flex items-center justify-center
            hover:bg-red-500
            transition
          "
        >
          <i className="fas fa-times" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* PREVIEW with Carousel */}
          <div
            className="
            w-full md:w-1/2
            bg-black
            flex items-center justify-center
            relative
          "
          >
            {/* Carousel Container */}
            <div className="w-full h-full overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {files.map((file: string, index: number) => {
                  const fileUrl = `${API_URL}/uploads/${file}`;
                  const isPDF = file?.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={index}
                      className="w-full h-full shrink-0 flex items-center justify-center min-h-[300px] md:min-h-[400px]"
                    >
                      {isPDF ? (
                        <PDFThumbnail url={fileUrl} />
                      ) : (
                        <img
                          src={fileUrl}
                          alt={file}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows - Show only if multiple files */}
              {totalFiles > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#6c63ff] text-white flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#6c63ff] text-white flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {files.map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(index);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          index === currentIndex
                            ? "bg-[#6c63ff] scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DETAIL */}
          <div
            className="
            w-full md:w-1/2
            p-5 sm:p-8
            flex flex-col justify-between
          "
          >
            <div>
              <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-300">
                {portfolio.level?.toUpperCase()}
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                {portfolio.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-400 mb-4">
                {portfolio.startDate} – {portfolio.endDate}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {portfolio.description}
              </p>

              {/* File Counter */}
              {totalFiles > 1 && (
                <p className="mt-4 text-sm text-slate-500">
                  ไฟล์ที่ {currentIndex + 1} จาก {totalFiles} ไฟล์
                </p>
              )}
            </div>

            <button
              onClick={handleDownloadAll}
              className="
                mt-6 sm:mt-8
                w-full
                flex items-center justify-center gap-2
                rounded-xl
                bg-linear-to-br from-[#6c63ff] to-[#5a52d5]
                py-3
                text-white font-semibold
                hover:-translate-y-1
                hover:shadow-[0_10px_30px_rgba(108,99,255,0.5)]
                transition
                cursor-pointer
              "
            >
              <i className="fas fa-download" />
              ดาวน์โหลดไฟล์ทั้งหมด ({totalFiles})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
