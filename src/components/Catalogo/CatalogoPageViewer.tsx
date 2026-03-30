import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogoPageViewerProps {
  pageNumber: number;
  showControls?: boolean;
  showDownload?: boolean;
  onPageChange?: (newPage: number) => void;
  totalPages?: number;
}

// Set worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const TOTAL_CATALOG_PAGES = 74; // Pages 1-74 available

export const CatalogoPageViewer: React.FC<CatalogoPageViewerProps> = ({
  pageNumber = 1,
  showControls = true,
  showDownload = true,
  onPageChange,
  totalPages = TOTAL_CATALOG_PAGES
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Validate page number
        if (pageNumber < 1 || pageNumber > TOTAL_CATALOG_PAGES) {
          setError(`Página ${pageNumber} no existe. El catálogo tiene ${TOTAL_CATALOG_PAGES} páginas.`);
          setIsLoading(false);
          return;
        }

        // Determine PDF URL based on page number
        let pdfUrl: string;
        if (pageNumber === 1 || pageNumber === 2) {
          // Pages 1-2 use the combined PDF for reference
          pdfUrl = '/catalogo-melman.pdf';
        } else {
          // Pages 3+ use individual page PDFs
          pdfUrl = `/catalogo/pages/page-${pageNumber}.pdf`;
        }

        // Load PDF
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

        // Get and render page (always page 1 for individual PDFs, or the specific page for combined)
        const actualPageNum = (pageNumber === 1 || pageNumber === 2) ? pageNumber : 1;
        const page = await pdf.getPage(actualPageNum);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
          setError('No se pudo obtener contexto del canvas');
          setIsLoading(false);
          return;
        }

        const renderTask = page.render({
          canvasContext: context,
          viewport
        });

        await renderTask.promise;
        setIsLoading(false);
      } catch (err) {
        setError(`Error al cargar la página: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        setIsLoading(false);
      }
    };

    renderPage();
  }, [pageNumber, scale]);

  const handlePrevPage = () => {
    if (pageNumber > 1 && onPageChange) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < TOTAL_CATALOG_PAGES && onPageChange) {
      onPageChange(pageNumber + 1);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/catalogo-melman.pdf';
    link.download = 'catalogo-melman.pdf';
    link.click();
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleFitWidth = () => setScale(1.5);

  return (
    <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
      {/* Controls */}
      {(showControls || showDownload) && (
        <div className="flex items-center justify-between bg-white rounded p-3 border border-gray-200">
          <div className="flex gap-2">
            {showControls && (
              <>
                <button
                  onClick={handlePrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página anterior"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="px-3 py-2 text-sm font-medium">
                  Página {pageNumber} de {TOTAL_CATALOG_PAGES}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={pageNumber >= TOTAL_CATALOG_PAGES}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página siguiente"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="flex gap-1 ml-4 border-l pl-4">
                  <button
                    onClick={handleZoomOut}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span className="px-2 py-1 text-xs">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={handleFitWidth}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Ajustar
                  </button>
                </div>
              </>
            )}
          </div>

          {showDownload && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              <Download size={16} />
              Descargar PDF
            </button>
          )}
        </div>
      )}

      {/* Canvas container */}
      <div className="flex justify-center bg-white rounded p-4 border border-gray-200 max-h-[70vh] overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96 text-red-500">
            <div className="text-center">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded max-w-full"
          />
        )}
      </div>

      {/* Page info */}
      {!isLoading && !error && (
        <div className="text-xs text-gray-500 text-center">
          Catálogo Melman • Página {pageNumber} de {TOTAL_CATALOG_PAGES}
        </div>
      )}
    </div>
  );
};

export default CatalogoPageViewer;
