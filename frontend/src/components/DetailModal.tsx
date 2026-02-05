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
  if (!isOpen || !portfolio) return null;

  const file = portfolio.files?.[0];
  const fileUrl = `${API_URL}/uploads/${file}`;
  const isPDF = file?.toLowerCase().endsWith(".pdf");

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
          {/* PREVIEW */}
          <div className="
            w-full md:w-1/2
            bg-black
            flex items-center justify-center
          ">
            <div className="w-full h-full overflow-hidden">
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
          </div>

          {/* DETAIL */}
          <div className="
            w-full md:w-1/2
            p-5 sm:p-8
            flex flex-col justify-between
          ">
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
              Download Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
