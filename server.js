const net = require("net");

const PORT = process.env.PORT || 4000;
const IDLE_TIMEOUT = 60000; 
const clients = new Map();

const server = net.createServer((socket) => {
  socket.setEncoding("utf8");
  console.log("New client connected:", socket.remoteAddress, socket.remotePort);

  let username = null;
  let lastActive = Date.now();

  const send = (msg) => socket.write(msg + "\n");
  const broadcast = (msg, exclude) => {
    for (const [client, name] of clients) {
      if (client !== exclude) client.write(msg + "\n");
    }
  };

  const disconnect = () => {
    if (username) {
      clients.delete(socket);
      broadcast(`INFO ${username} disconnected`, socket);
      console.log("Client disconnected:", username);
      try {
        socket.end();
      } catch {}
      username = null;
    }
  };

  const idleCheck = setInterval(() => {
    if (Date.now() - lastActive > IDLE_TIMEOUT) {
      send("INFO idle-timeout");
      disconnect();
      clearInterval(idleCheck);
    }
  }, 5000);

  socket.on("data", (data) => {
    const message = data.toString().trim();
    if (!message) return;
    lastActive = Date.now();

    if (!username) {
      if (message.startsWith("LOGIN ")) {
        const name = message.substring(6).trim();
        if (!name) return send("ERR invalid-username");
        if ([...clients.values()].includes(name)) return send("ERR username-taken");
        username = name;
        clients.set(socket, username);
        send("OK");
        broadcast(`INFO ${username} connected`, socket);
      } else {
        send("ERR please-login-first");
      }
      return;
    }

    if (message.startsWith("MSG ")) {
      const text = message.substring(4).trim();
      if (text) broadcast(`MSG ${username} ${text}`, socket);
    } else if (message === "WHO") {
      for (const name of clients.values()) send(`USER ${name}`);
    } else if (message.startsWith("DM ")) {
      const parts = message.split(" ");
      const target = parts[1];
      const text = parts.slice(2).join(" ").trim();
      if (!target || !text) return send("ERR dm-format");
      let found = false;
      for (const [client, name] of clients) {
        if (name === target) {
          client.write(`DM ${username} ${text}\n`);
          send(`DM ${username} -> ${target} ${text}`);
          found = true;
          break;
        }
      }
      if (!found) send("ERR user-not-found");
    } else if (message === "PING") {
      send("PONG");
    } else {
      send("ERR unknown-command");
    }
  });

  socket.on("end", () => {
    clearInterval(idleCheck);
    disconnect();
  });

  socket.on("error", () => {
    clearInterval(idleCheck);
    disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
