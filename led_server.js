import http from "node:http";
import net from "node:net";

const HOST = "192.168.68.124";
const SOCKET_PORT = 8933;
const HTTP_PORT = 8989;

const socket = new net.Socket();

socket.connect(SOCKET_PORT, HOST, () => {
  console.log("Socket connected");
});

socket.on("close", () => console.log("Connection closed"));
socket.on("error", (err) => console.error("Socket error:", err));

const httpServer = http.createServer();

httpServer.on("request", (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (body === "LED_ON" || body === "LED_OFF" || body === "LED_TOGGLE") {
      socket.setNoDelay(true);
      socket.write(body + "\n");
      logMessage(`${body} sent`);
    }

    res.writeHead(200, "Content-Type: text/plain");
    res.end("OK");
  });
});

httpServer.listen(HTTP_PORT);

console.log("Server running on port", HTTP_PORT);

function logMessage(message) {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  const ms = d.getMilliseconds().toString().padStart(3, "0");
  console.log(`${hh}:${mm}:${ss}.${ms}: ${message}`);
}
