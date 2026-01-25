import fs from "fs";
import path from "path";

const bookDir = path.join("public", "book");
const outputFile = path.join(bookDir, "book.json");

// Read all image files in the folder
const files = fs.readdirSync(bookDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const data = {
  pages: files
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log("✅ book.json generated with", files.length, "pages");
