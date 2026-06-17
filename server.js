const path = require("path");
const fastify = require("fastify");
const fastifyStatic = require("@fastify/static");
const { getAllArticles, getArticleBySlug } = require("./articles");

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
  return reply.sendFile("articles.html");
});

app.get("/api/articles", async (request, reply) => {
  return reply.send(getAllArticles());
});

app.get("/api/articles/:slug", async (request, reply) => {
  const article = getArticleBySlug(request.params.slug);
  if (!article) {
    return reply.code(404).send({ error: "Article not found." });
  }
  return reply.send(article);
});

app.get("/articles/:slug", async (request, reply) => {
  const article = getArticleBySlug(request.params.slug);
  if (!article) {
    return reply.code(404).type("text/html; charset=UTF-8").sendFile("404.html");
  }

  const articleHtml = renderArticlePage(article);
  return reply.code(200).type("text/html; charset=UTF-8").send(articleHtml);
});

app.setNotFoundHandler(async (request, reply) => {
  return reply.code(404).type("text/html; charset=UTF-8").sendFile("404.html");
});

function renderArticlePage(article) {
  const bodyHtml = article.body
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph)}</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(article.title)} | Tomislav HQ</title>
    <meta name="description" content="${escapeHtml(article.summary)}" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="site-shell">
      <header class="site-header">
        <nav class="container site-nav">
          <a href="/" class="brand">tomislav<span class="brand-dot">.</span>hq</a>
          <div class="nav-links">
            <a href="/">Home</a>
            <a href="/articles" class="active">Articles</a>
          </div>
        </nav>
      </header>

      <main class="container article-main" style="max-width: 840px">
        <a href="/articles" class="back-link">
          <span aria-hidden="true">&larr;</span>
          Back to articles
        </a>
        <article class="article-sheet">
          <p class="article-meta">${escapeHtml(article.publishedAt)} · ${escapeHtml(article.readTime)}</p>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="summary">${escapeHtml(article.summary)}</p>
          ${bodyHtml}
        </article>
      </main>
    </div>
  </body>
</html>`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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
