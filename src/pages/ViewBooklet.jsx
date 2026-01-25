import { useEffect, useState } from "react";
// import FlipbookViewer from "../components/FlipbookViewer";
import VerticalFlipBook from "../components/VerticalFlipBook";

export default function ViewBooklet() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch("book/book.json")
      .then(res => res.json())
      .then(data => {
        const loadedPages = data.pages.map(name => ({
          image_url: `book/${name}`
        }));
        setPages(loadedPages);
      });
  }, []);  

  return (
    //FlipBookViewer version
    // <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
    //   <FlipbookViewer pages={pages} />
    // </div>

    // VerticalFlipBook version
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent">
          <VerticalFlipBook pages={pages} />
    </div>
  );
}
