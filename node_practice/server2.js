import { createServer } from "http";

const PORT = process.env.PORT || 3000;

let users = [
  { id: 1, name: "Tech Mahe" },
  { id: 2, name: "Senthil" },
  { id: 3, name: "Venkat" },
];

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// JSON header middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

// Body parser middleware
const bodyParser = (req, res, next) => {
  if (["POST", "PUT"].includes(req.method)) {
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        next();
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  } else {
    next();
  }
};

// GET /api/users
const getUsers = (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify(users));
};

// GET /api/users/:id
const getUserById = (req, res, match) => {
  const id = parseInt(match[1]);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "User not found" }));
  }

  res.writeHead(200);
  res.end(JSON.stringify(user));
};

// POST /api/users
const createUser = (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "Name is required" }));
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
  };

  users.push(newUser);

  res.writeHead(201);
  res.end(JSON.stringify(newUser));
};

// PUT /api/users/:id
const updateUser = (req, res, match) => {
  const id = parseInt(match[1]);
  const { name } = req.body;

  const user = users.find((u) => u.id === id);
  if (!user) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "User not found" }));
  }

  if (!name) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "Name is required" }));
  }

  user.name = name;

  res.writeHead(200);
  res.end(JSON.stringify(user));
};

// DELETE /api/users/:id
const deleteUser = (req, res, match) => {
  const id = parseInt(match[1]);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.writeHead(404);
    return res.end(JSON.stringify({ message: "User not found" }));
  }

  const deletedUser = users.splice(index, 1);

  res.writeHead(200);
  res.end(JSON.stringify(deletedUser[0]));
};

// 404 handler
const notFound = (req, res) => {
  res.writeHead(404);
  res.end(JSON.stringify({ message: "Route not found" }));
};

/* ---------------- Server ---------------- */

const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      bodyParser(req, res, () => {
        const match = req.url.match(/^\/api\/users\/([0-9]+)$/);

        if (req.method === "GET" && req.url === "/api/users") {
          return getUsers(req, res);
        }

        if (req.method === "GET" && match) {
          return getUserById(req, res, match);
        }

        if (req.method === "POST" && req.url === "/api/users") {
          return createUser(req, res);
        }

        if (req.method === "PUT" && match) {
          return updateUser(req, res, match);
        }

        if (req.method === "DELETE" && match) {
          return deleteUser(req, res, match);
        }

        notFound(req, res);
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
