const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  res.statusCode = 200;

  if (url === "/" && method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Home Page</h1>");
  } else if (url === "/about" && method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>About Page</h1>");
  } else {
    res.statusCode = 404;

    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Not found</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
