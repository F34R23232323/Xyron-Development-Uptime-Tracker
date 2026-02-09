
# Xyron Development – Uptime Tracker

A self-hosted uptime monitoring service maintained by **Xyron Development**, built on top of the powerful **Uptime Kuma** project.  

This repository is used internally to monitor the availability, latency, and health of services operated by Xyron Development.

---

## ⭐ Features

- Monitor uptime for:
  - HTTP(s)
  - TCP
  - HTTP(s) Keyword
  - HTTP(s) JSON Query
  - WebSocket
  - Ping
  - DNS Record
  - Push
  - Steam Game Server
  - Docker Containers
- Fancy, reactive, fast UI/UX
- Notifications via:
  - Telegram
  - Discord
  - Gotify
  - Slack
  - Pushover
  - Email (SMTP)
  - And **90+ notification services**  
    👉 [Notification Services Directory](https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/tree/master/src/components/notifications)
- 20-second monitoring intervals
- Multi-language support  
  👉 [Language Files](https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/tree/master/src/lang)
- Multiple status pages
- Domain-mapped status pages
- Ping charts
- SSL certificate information
- Proxy support
- Two-factor authentication (2FA)

---

## 🔧 How to Install

This project follows the same installation methods as **Uptime Kuma**. Choose the method that best fits your environment.

---

### 🐳 Docker Compose (Recommended)

```bash
mkdir uptime-kuma
cd uptime-kuma
curl -o compose.yaml https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/master/compose.yaml
docker compose up -d
````

This will run Uptime Kuma in a container with all dependencies pre-installed. Recommended for most users.

---

### 💪🏻 Non-Docker Installation

For users who prefer or require a **native installation** without Docker.

#### **Requirements**

**Platform Support**
✅ Major Linux distributions: Debian, Ubuntu, Fedora, ArchLinux, etc.
✅ Windows 10 (x64) / Windows Server 2012 R2 (x64) or higher
❌ FreeBSD / OpenBSD / NetBSD (not supported)
❌ Replit / Heroku (not supported)

**Software Requirements**

* Node.js >= 20.4
* Git
* **PM2** (recommended for running Uptime Kuma in the background)

---

#### **Installation Steps**

1. **Clone the repository**

```bash
git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
```

2. **Set up the project**

```bash
npm run setup
```

3. **Run the server**

**Option 1 – Quick Start (Foreground)**

```bash
node server/server.js
```

This will start the server in your terminal. Press `Ctrl + C` to stop.

**Option 2 – Recommended: Run in the Background with PM2**

* Install PM2 if you haven’t already:

```bash
npm install pm2 -g
pm2 install pm2-logrotate
```

* Start Uptime Kuma:

```bash
pm2 start server/server.js --name "uptime-kuma"
pm2 save
```

* Optional: Enable automatic startup on system reboot:

```bash
pm2 startup
```

This ensures Uptime Kuma runs continuously in the background without manual intervention.

---

#### **Accessing the Web Interface**

* Open a web browser and navigate to:

  ```
  http://localhost:3001
  ```
* For remote servers, replace `localhost` with your server IP.

---

#### **Additional Notes**

* Data is stored locally in the `data/` directory.
* Logs can be accessed via PM2:

```bash
pm2 logs uptime-kuma
```

* PM2 automatically handles restarts in case of crashes.
* For advanced configuration (ports, database, reverse proxy, etc.), refer to the **Uptime Kuma documentation**.
* ItzF34R.mp4! personally uses docker as other bots / websites run on PM2.
