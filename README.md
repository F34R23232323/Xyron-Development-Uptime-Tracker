# Xyron Development – Uptime Tracker

A self-hosted uptime monitoring service maintained by **Xyron Development**, built on top of the powerful **Uptime Kuma** project.

This repository is used internally to monitor the availability, latency, and health of services operated by Xyron Development.

---

## ⭐ Features

- Monitoring uptime for:
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
    👉 https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/tree/master/src/components/notifications
- 20-second monitoring intervals
- Multi-language support  
  👉 https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/tree/master/src/lang
- Multiple status pages
- Domain-mapped status pages
- Ping charts
- SSL certificate information
- Proxy support
- Two-factor authentication (2FA)

---

## 🔧 How to Install

This project follows the same installation methods as **Uptime Kuma**.  
Choose the method that best fits your environment.

---

### 🐳 Docker Compose (Recommended)

```bash
mkdir uptime-kuma
cd uptime-kuma
curl -o compose.yaml https://github.com/F34R23232323/Xyron-Development-Uptime-Tracker/master/compose.yaml
docker compose up -d
