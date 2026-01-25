import { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import Thumbnails from "./Thumbnails";

export default function FlipbookViewer({ pages }) {
  const bookRef = useRef(null);
  const flipRef = useRef(null);
  const flipSoundRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState(1);

  // Zoom on double click
  const handleZoom = () => {
    const book = bookRef.current;
    book.classList.toggle("scale-125");
    book.classList.toggle("cursor-zoom-out");
  };

  const handlePageJump = (e) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(pageInput);
  
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pages.length) {
        flipRef.current.flip(pageNumber - 1); // PageFlip is 0-indexed
      } else {
        setPageInput(currentPage + 1); // reset if invalid
      }
    }
  };
  
  const goNext = () => {
    flipRef.current?.flipNext();
  };
  
  const goPrev = () => {
    flipRef.current?.flipPrev();
  };
  

  // Load sound once
  useEffect(() => {
    flipSoundRef.current = new Audio("/flip.mp3"); // put flip.mp3 in PUBLIC folder
    flipSoundRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    if (!pages.length) return;

    flipRef.current = new PageFlip(bookRef.current, {
      width: 500, //700
      height: 800, //900
      size: "stretch",
      minWidth: 350,
      maxWidth: 900, //1200
      minHeight: 500,
      maxHeight: 1000, //1600
      maxShadowOpacity: 0.5,
      usePortrait:true,
      showCover: true,
      mobileScrollSupport: false,
      flippingTime: 1100,
      drawShadow: true,
      // showPageCorners: true,
      useMouseEvents: true,
    });

    const pageElements = pages.map((page) => {
      const el = document.createElement("div");
      el.className = "page relative";
      el.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20 pointer-events-none"></div>
        <img src="${page.image_url}" style="width:100%;height:100%;object-fit:cover;" />
      `;
      return el;
    });

    flipRef.current.loadFromHTML(pageElements);

    flipRef.current.on("flip", (e) => {
      setCurrentPage(e.data);
      setPageInput(e.data + 1); 

      if (flipSoundRef.current) {
        flipSoundRef.current.currentTime = 0;
        flipSoundRef.current.play();
      }
    });

    return () => flipRef.current.destroy();
  }, [pages]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
  
      <div className="bg-neutral-900/80 backdrop-blur-lg px-8 pt-8 pb-6 rounded-3xl shadow-[0_30px_120px_rgba(0,0,0,0.8)] flex flex-col items-center">

        {/* Book */}
        <div className="w-[320px] sm:w-[400px] md:w-[500px] flex flex-col items-center">

          <div
            ref={bookRef}
            onDoubleClick={handleZoom}
            className="transition-transform duration-300 cursor-zoom-in"
          />
        </div>
  
        {/* Page Number */}
        <div
  id="page-indicator"
  className="mt-5 w-full text-gray-300 text-lg flex items-center justify-between transition-opacity duration-300 border-t border-white/10 pt-4"
>
  {/* Prev Button */}
  <button
    onClick={goPrev}
    className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition text-gray-300"
  >
    ⬅ Prev
  </button>

  {/* Page Input */}
  <div className="flex items-center gap-2">
          <span className="text-gray-400">Page</span>

          <input
            type="number"
            min="1"
            max={pages.length}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={handlePageJump}
            className="w-12 bg-transparent text-center text-white outline-none appearance-none"
          />

          <span className="text-gray-400">of {pages.length}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={goNext}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition text-gray-300"
        >
          Next ➡
        </button>
      </div>


  
      </div>
    </div>
  );
  
}
