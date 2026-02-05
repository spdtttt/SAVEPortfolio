import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFThumbnail = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPDF = async () => {
      try {
        // ยกเลิก render task เก่าก่อน (ถ้ามี)
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const pdf = await pdfjsLib.getDocument(url).promise;

        if (isCancelled) return;

        const page = await pdf.getPage(1);

        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;

        if (!canvas || isCancelled) return;

        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // เก็บ render task ไว้เพื่อให้สามารถยกเลิกได้
        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
          canvas,
        });

        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
      } catch (error: any) {
        // ไม่ต้อง log error ถ้าเป็นการ cancel ตามปกติ
        if (error?.name !== "RenderingCancelledException") {
          console.error("PDF render error:", error);
        }
      }
    };

    renderPDF();

    // Cleanup function - ยกเลิก render task เมื่อ component unmount หรือ url เปลี่ยน
    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [url]);

  return <canvas ref={canvasRef} className="w-full h-full shadow-lg" />;
};

export default PDFThumbnail;
