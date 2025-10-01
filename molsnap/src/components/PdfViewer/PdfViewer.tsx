// PdfViewer.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import "./PdfViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;


type PdfViewerProps = {
  file: File | string | ArrayBuffer | null;
  initialPage?: number;
  initialScale?: number;
  onLoadSuccess?: ({ numPages }: { numPages: number }) => void;
};

export default function PdfViewer({
  file,
  initialPage = 1,
  initialScale = 1.0,
  onLoadSuccess,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const [rotate, setRotate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // track file identity so when file changes we reset UI
  const fileRef = useRef(null);

  useEffect(() => {
    setError(null);
    if (!file) {
      setNumPages(null);
      setPage(1);
      setLoading(false);
      fileRef.current = null;
      return;
    }

    // reset when new file is passed
    const isSame =
      fileRef.current &&
      typeof fileRef.current !== "string" &&
      typeof file !== "string" &&
      // if both are File objects, compare name + size + lastModified if available
      fileRef.current.name === file.name &&
      fileRef.current.size === file.size &&
      fileRef.current.lastModified === file.lastModified;

    if (!isSame) {
      setPage(initialPage);
      setScale(initialScale);
      setRotate(0);
      setNumPages(null);
      fileRef.current = file;
    }
  }, [file, initialPage, initialScale]);

  const onDocumentLoadSuccess = useCallback(
    (doc) => {
      setNumPages(doc.numPages);
      setLoading(false);
      setError(null);
      if (typeof onLoadSuccess === "function") {
        onLoadSuccess({ numPages: doc.numPages });
      }
      // clamp page within range
      setPage((p) => {
        if (!doc.numPages) return 1;
        if (p > doc.numPages) return doc.numPages;
        if (p < 1) return 1;
        return p;
      });
    },
    [onLoadSuccess]
  );

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF load error:", err);
    setError(err?.message || "Failed to load PDF");
    setLoading(false);
  }, []);

  // user actions
  const goToPage = useCallback(
    (p) => {
      if (!numPages) return;
      const next = Math.min(Math.max(1, Math.floor(p)), numPages);
      setPage(next);
    },
    [numPages]
  );

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  const zoomIn = useCallback(() => setScale((s) => Number((s * 1.2).toFixed(2))), []);
  const zoomOut = useCallback(() => setScale((s) => Number((s / 1.2).toFixed(2))), []);
  const resetZoom = useCallback(() => setScale(initialScale), [initialScale]);

  const rotateLeft = useCallback(() => setRotate((r) => (r - 90) % 360), []);
  const rotateRight = useCallback(() => setRotate((r) => (r + 90) % 360), []);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!file) return;
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [file, prevPage, nextPage, zoomIn, zoomOut]);

  // small utility to download the current file if it's a File
  const downloadRef = useRef(null);
  const downloadFile = useCallback(() => {
    if (!file) return;
    if (typeof file === "string") {
      // remote url
      const a = document.createElement("a");
      a.href = file;
      a.download = file.split("/").pop() || "document.pdf";
      a.click();
      return;
    }
    // File/Blob
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "document.pdf";
    a.click();
    // revoke after a while
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [file]);

  // Loading state while Document is loading
  useEffect(() => {
    if (file) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [file]);

  // render fallback UI when there's no file
  if (!file) {
    return (
      <div className="pdfviewer-empty">
        <p>No PDF selected. Drop a file into your dropbox to preview it.</p>
      </div>
    );
  }

  return (
    <div className="pdfviewer-root" role="region" aria-label="PDF viewer">
      <div className="pdfviewer-toolbar">
        <div className="pdfviewer-controls-left">
          <button onClick={prevPage} disabled={!numPages || page <= 1} title="Previous page">
            ←
          </button>
          <span className="pdfviewer-page-indicator">
            <input
              type="number"
              className="pdfviewer-page-input"
              min={1}
              max={numPages || 1}
              value={page}
              onChange={(e) => goToPage(Number(e.target.value))}
              aria-label="Page number"
            />
            <span>/ {numPages || "?"}</span>
          </span>
          <button onClick={nextPage} disabled={!numPages || page >= numPages} title="Next page">
            →
          </button>
        </div>

        <div className="pdfviewer-controls-center">
          <button onClick={zoomOut} title="Zoom out">−</button>
          <span className="pdfviewer-scale">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} title="Zoom in">+</button>

          <button onClick={resetZoom} title="Reset zoom">Reset</button>

          <button onClick={rotateLeft} title="Rotate left">⤺</button>
          <button onClick={rotateRight} title="Rotate right">⤻</button>
        </div>

        <div className="pdfviewer-controls-right">
          <button onClick={downloadFile} title="Download PDF">⬇ Download</button>
        </div>
      </div>

      <div className="pdfviewer-canvas-area">
        {loading && <div className="pdfviewer-loading">Loading PDF…</div>}
        {error && <div className="pdfviewer-error">Error: {String(error)}</div>}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="pdfviewer-loading-inline">Loading document…</div>}
          error={<div className="pdfviewer-error-inline">Failed to load document</div>}
          noData={<div className="pdfviewer-empty-inline">No PDF data provided</div>}
        >
          <div className="pdfviewer-page-wrapper">
            <Page
              pageNumber={page}
              scale={scale}
              rotate={rotate}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={<div className="pdfviewer-page-loading">Rendering page…</div>}
            />
          </div>
        </Document>
      </div>

      {/* small page preview list (lightweight) */}
      {numPages > 1 && (
        <div className="pdfviewer-thumbs" aria-hidden>
          {Array.from({ length: numPages }, (_, idx) => (
            <button
              key={idx + 1}
              className={`pdfviewer-thumb ${page === idx + 1 ? "active" : ""}`}
              onClick={() => goToPage(idx + 1)}
              title={`Go to page ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

PdfViewer.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.instanceOf(ArrayBuffer)]),
  initialPage: PropTypes.number,
  initialScale: PropTypes.number,
  onLoadSuccess: PropTypes.func,
};
