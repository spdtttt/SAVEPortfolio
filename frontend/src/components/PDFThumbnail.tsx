import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFThumbnail = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPDF = async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvas: canvas,
        canvasContext: context,
        viewport,
      });
    };

    renderPDF();
  }, [url]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full shadow-lg"
    />
  );
};

export default PDFThumbnail;