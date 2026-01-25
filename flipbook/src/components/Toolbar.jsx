export default function Toolbar({ flipRef }) {
    return (
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-xl flex gap-4 z-50">
        <button onClick={() => flipRef.current.flipPrev()}>⬅ Prev</button>
        <button onClick={() => flipRef.current.flipNext()}>Next ➡</button>
      </div>
    );
  }
  