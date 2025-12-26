import http from "http";
import path from "path";
import url from "url";
import fs from "fs/promises";

const PORT = process.env.PORT;
// Get current path
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname, __filename);

const server = http.createServer(async (req, res) => {
  const { url: reqURL, method } = req;

  try {
    // Check if GET request
    if (method === "GET") {
      let filePath;
      if (reqURL === "/") {
        filePath = path.join(__dirname, "public", "index.html");
      } else if (reqURL === "/about") {
        filePath = path.join(__dirname, "public", "about.html");
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
      }
      const data = await fs.readFile(filePath);
      console.log("data", data);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
