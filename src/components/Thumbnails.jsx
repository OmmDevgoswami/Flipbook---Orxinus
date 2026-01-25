export default function Thumbnails({ pages, flipRef }) {
    return (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-[80%] overflow-y-auto bg-black/40 backdrop-blur-md p-2 rounded-xl space-y-2">
        {pages.map((p, i) => (
          <img
            key={i}
            src={p.image_url}
            onClick={() => flipRef.current.flip(i)}
            className="cursor-pointer rounded-md hover:scale-105 transition"
          />
        ))}
      </div>
    );
  }
  