const path = require("path");
const fastify = require("fastify");
const fastifyStatic = require("@fastify/static");

const PORT = process.env.PORT || 3000;
const HOST =
  process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const PUBLIC_DIR = path.join(__dirname, "public");
const app = fastify({
  logger: process.env.NODE_ENV === "development",
});

app.register(fastifyStatic, {
  root: PUBLIC_DIR,
  prefix: "/",
});

app.get("/", async (request, reply) => {
  return reply.sendFile("index.html");
});

app.get("/articles", async (request, reply) => {
  return reply.code(404).type("text/html; charset=UTF-8").sendFile("404.html");
});

app.get("/api/articles", async (request, reply) => {
  return reply.code(404).send({ error: "Articles are not published yet." });
});

app.get("/api/articles/:slug", async (request, reply) => {
  return reply.code(404).send({ error: "Article not found." });
});

app.get("/articles/:slug", async (request, reply) => {
  return reply.code(404).type("text/html; charset=UTF-8").sendFile("404.html");
});

app.setNotFoundHandler(async (request, reply) => {
  return reply.code(404).type("text/html; charset=UTF-8").sendFile("404.html");
});

const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`tomislavhq running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
