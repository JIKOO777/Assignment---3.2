# Aitu market — Assignment 3 Part 2 (Online Market + CRUD + Render

##  Live Demo (Render)
- Web App: https://assignment-3-2-03vp.onrender.com/
- API (products):https://assignment-3-2-03vp.onrender.com/api/products

> Replace `YOUR-RENDER-APP` with your real Render URL.

---

## Features
- Multi-page online market UI:
  - `/` — Catalog (cards view, search, sort, CRUD actions)
  - `/add.html` — Add product (Create)
  - `/edit.html?id=...` — Edit product (Update/Delete)
  - `/admin.html` — Admin table (CRUD in table format)
  - `/about.html` — Project info + endpoints
- Backend REST API:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- Environment variables:
  - Uses `process.env.PORT`
  - Uses `process.env.MONGO_URI` (MongoDB Atlas)

---

## 🔧 Setup (Local)
### 1) Install
```bash
npm install
