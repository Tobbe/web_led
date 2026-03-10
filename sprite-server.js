import fs from "node:fs";
import http from "node:http";
import qs from "node:querystring";

import { handleMessage } from "./messages.js";

const PORT = 8080;

const html = fs.readFileSync("./index.html", "utf-8");

// Basic server: serves HTML on GET and handles form POST on /
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    // Serve index.html
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (req.method === "POST" && req.url === "/messages") {
    // Expect JSON body { message: "..." }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.socket.destroy();
    });

    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body);
        const msg = parsed?.message ? String(parsed.message).trim() : "";

        if (!msg) {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Message required");

          return;
        }

        console.log("Received message:", msg);
        await handleMessage(msg);

        res.writeHead(202, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Accepted");
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Invalid JSON");
      }
    });

    return;
  }

  // Fallback for no-js
  if (req.method === "POST" && req.url === "/") {
    // Collect POST body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.socket.destroy();
    });

    req.on("end", () => {
      const parsed = qs.parse(body);
      const message = parsed.message || "";

      // Server-side processing: here we just log
      console.log("Received message:", message);

      // Respond with a confirmation page that includes the escaped message
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Received</title>
<style>
  body{font-family:system-ui, -apple-system, "Segoe UI", Roboto, Arial; background:#f8fafc; padding:24px}
  .box{max-width:720px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;box-shadow:0 6px 18px rgba(2,6,23,0.06)}
  a{color:#4f46e5;text-decoration:none}
  .received{margin-top:12px;padding:14px;background:#fbfdff;border:1px solid #eef2ff;border-radius:10px}
</style>
</head>
<body>
  <div class="box">
    <h1>Message received</h1>
    <p>We got your message. Server logged it and shows it below:</p>
    <div class="received">${escapeHtml(message)}</div>
    <p style="margin-top:18px"><a href="/">Send another</a></p>
  </div>
</body>
</html>`);
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

// Basic HTML-escaping to avoid reflected XSS in the response
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
