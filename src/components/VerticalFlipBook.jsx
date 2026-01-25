import { useState, useRef, useEffect } from "react";

export default function VerticalFlipBook({ pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flipSpeed, setFlipSpeed] = useState(0.6);
  const startYRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const flipSoundRef = useRef(null);

  // Load flip sound
  useEffect(() => {
    flipSoundRef.current = new Audio("flip.mp3");
    flipSoundRef.current.volume = 0.3;
  }, []);

  // 🔥 Keep input synced with current page
  useEffect(() => {
    setPageInput(currentPage + 1);
  }, [currentPage]);

  const playFlip = () => {
    flipSoundRef.current.currentTime = 0;
    flipSoundRef.current.play();
  };

  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      playFlip();
    }
  };

  const handlePageJump = (e) => {
    if (e.key === "Enter") {
      let pageNum = parseInt(pageInput);
      if (!isNaN(pageNum)) {
        pageNum = Math.max(1, Math.min(pageNum, pages.length));
        goToPage(pageNum - 1);
      }
    }
  };

  const startDrag = (clientY) => {
    setIsDragging(true);
    startYRef.current = clientY;
    lastMoveTimeRef.current = Date.now();
  };

  const onDrag = (clientY) => {
    if (!isDragging) return;
    const diff = startYRef.current - clientY;
    const now = Date.now();
    const velocity = Math.abs(diff) / (now - lastMoveTimeRef.current + 1);
    setFlipSpeed(Math.min(Math.max(velocity, 0.4), 1));
    lastMoveTimeRef.current = now;
    setDragOffset(diff);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 60 && currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
      playFlip();
    } else if (dragOffset < -60 && currentPage > 0) {
      setCurrentPage((p) => p - 1);
      playFlip();
    }

    setDragOffset(0);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
      playFlip();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      playFlip();
    }
  };

  return (
    <div className="flex flex-col items-center select-none text-white">
      {/* BOOK */}
      <div
        className="relative w-[360px] h-[560px] perspective cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => startDrag(e.clientY)}
        onMouseMove={(e) => onDrag(e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        onTouchMove={(e) => onDrag(e.touches[0].clientY)}
        onTouchEnd={endDrag}
      >
        {pages.map((page, i) => {
          const isBelow = i < currentPage;
          const isCurrent = i === currentPage;

          let rotation = 0;
          if (isBelow) rotation = 180;
          if (isCurrent && isDragging) {
            rotation = Math.min(Math.max(dragOffset * 0.8, 0), 180);
          }

          const isNeighbor =
            i === currentPage || i === currentPage - 1 || i === currentPage + 1;
          const isHidden = !isNeighbor;

          return (
            <div
              key={i}
              className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl origin-top"
              style={{
                transform: `rotateX(${rotation}deg)`,
                transformStyle: "preserve-3d",
                zIndex: isHidden ? 0 : pages.length - i,
                opacity: isHidden ? 0 : 1,
                transition: isDragging
                  ? "none"
                  : `transform ${flipSpeed}s cubic-bezier(.22,.61,.36,1), opacity 0.2s ease ${flipSpeed}s`,
                pointerEvents: isHidden ? "none" : "auto",
              }}
            >
              {/* FRONT */}
              <div className="absolute inset-0 backface-hidden">
                <img
                  src={page.image_url}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                  alt=""
                />
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 backface-hidden bg-neutral-100"
                style={{ transform: "rotateX(180deg)" }}
              />

              <div className="absolute top-0 left-0 w-full h-2 bg-black/20 blur-sm" />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,${
                    Math.abs(rotation) / 500
                  }) 0%, transparent 60%)`,
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,${
                    Math.abs(rotation) / 250
                  }) 0%, transparent 60%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* CONTROLS */}
      <div className="mt-8 flex items-center gap-6 bg-white/5 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg border border-white/10">
        <button
          type="button"
          onClick={prevPage}
          className="px-4 py-2 rounded-lg btn btn-outline-info hover:scale-105 active:scale-95 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
          </svg>
        </button>

        <div className="flex items-center gap-2 text-gray-800 font-medium">
            <span className="text-sm ps-4" style={{ color: "black", fontWeight: "bold" }}>Page</span>

            <input
                type="number"
                min="1"
                max={pages.length}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={handlePageJump}
                className="w-14 text-center text-red rounded-md py-0.5 border border-gray-400"
            />

            <span className="text-sm pe-4" style={{ color: "black", fontWeight: "bold" }}>/ {pages.length}</span>
        </div>


        <button
          type="button"
          onClick={nextPage}
          className="px-4 py-2 rounded-lg btn btn-outline-info hover:scale-105 active:scale-95 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
