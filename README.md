# Socket Chat Server (Node.js)

## Overview

A simple multi-client TCP chat server built using only Node.js standard library (`net` module).  
It supports multiple concurrent users, login system, real-time message broadcasting, user listing, private messaging, and idle timeout handling.  
No external frameworks or databases are used.

---

## Features

- Multiple clients can connect simultaneously
- Login required before chatting (`LOGIN <username>`)
- Message broadcasting (`MSG <text>`)
- Active user listing (`WHO`)
- Private messaging (`DM <username> <text>`)
- Heartbeat check (`PING` → `PONG`)
- Idle timeout (auto disconnect after 60 seconds of inactivity)
- Graceful handling of disconnects and username conflicts

---

## Requirements

- Node.js v18 or later
- Ncat / Netcat (for testing TCP connections)

---

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/socket-chat-server.git
   cd socket-chat-server
   ```
2. Run the server:
   ```bash
   node server.js
   ```

By default, the server listens on port 4000.
You can change it with an environment variable:

    ```bash
    set PORT=5000
    node server.js
    ```

---

## How to Connect (Using Ncat)

Open two separate terminals and run in each:

```bash
"C:\Program Files (x86)\Nmap\ncat.exe" localhost 4000
```

You’ll be connected to the chat server.

---

## Example Interaction

Client 1:

```nginx
LOGIN Alice
OK
MSG hi everyone
```

Client 2:

```nginx
LOGIN Bob
OK
INFO Alice connected
MSG hello Alice
```

Client 1 sees:

```nginx
INFO Bob connected
MSG Bob hello Alice
```

When Client 2 disconnects:

```nginx
INFO Bob disconnected
```

---

## Idle Timeout

If a user is inactive for 60 seconds, the server automatically disconnects them:

```nginx
INFO idle-timeout
INFO <username> disconnected
```

---

## Command List

| Command                | Description                                | Example               | Server Response                                       |
| ---------------------- | ------------------------------------------ | --------------------- | ----------------------------------------------------- |
| `LOGIN <username>`     | Log in with a unique username              | `LOGIN Alice`         | `OK`                                                  |
| `MSG <text>`           | Broadcast a message to all connected users | `MSG Hello everyone`  | `MSG Alice Hello everyone`                            |
| `WHO`                  | List all currently active users            | `WHO`                 | `USER Alice`<br>`USER Bob`                            |
| `DM <username> <text>` | Send a private message to a specific user  | `DM Bob hey`          | `DM Alice -> Bob hey`                                 |
| `PING`                 | Heartbeat check to verify connection       | `PING`                | `PONG`                                                |
| _(Auto)_               | User inactivity timeout (after 60 seconds) | _(No input)_          | `INFO idle-timeout`<br>`INFO <username> disconnected` |
| _(Auto)_               | When a user disconnects manually           | _(Closes connection)_ | `INFO <username> disconnected`                        |

---

## Folder Structure

socket-chat-server/<br/>
├── server.js<br/>
├── README.md<br/>
├── LICENSE<br/>
└── package.json<br/>

---

## License

- This project is licensed under the [MIT License](LICENSE).

---

## Contact

- **Meet T-Bot** - [Discover My Work](https://t-bot-blush.vercel.app/)
- **Tushar Bhardwaj** - [Portfolio](https://tushar-bhardwaj.vercel.app/)
- **Connect 1:1** - [Topmate](https://topmate.io/tusharbhardwaj)
- **GitHub:** [TuShArBhArDwA](https://github.com/TuShArBhArDwA)
- **LinkedIn:** [Tushar Bhardwaj](https://www.linkedin.com/in/bhardwajtushar2004/)
- **Email:** [tusharbhardwaj2617@example.com](mailto:tusharbhardwaj2617@example.com)

---

## Author

Developed by **Tushar Bhardwaj**
