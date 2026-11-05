# 🏫 Smart Campus Complaint Portal

A modern, high-performance, containerized web application designed for campus incident reporting, tracking, and administrative resolution. Built with React 19, Vite, and Tailwind CSS, and packaged with a production-grade multi-stage Docker configuration served by Nginx.

- **Live Website:** [https://smart-campus-complaint.vercel.app/](https://smart-campus-complaint.vercel.app/)
- **GitHub Repository:** [https://github.com/Nishanth2434/Smart-campus-complaint](https://github.com/Nishanth2434/Smart-campus-complaint)
- **Project Title:** Docker-Based Web Application (College Assignment)

---

## 📋 Table of Contents

- [Overview](#overview)
- [📦 What Was Added (Dockerization & Enhancements)](#-what-was-added-dockerization--enhancements)
- [✨ Application Features](#-application-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [📁 Project Folder Structure](#-project-folder-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🐳 Docker Installation Guide](#-docker-installation-guide)
- [🚀 Docker Setup & Usage](#-docker-setup--usage)
  - [1. Build Docker Image](#1-build-docker-image)
  - [2. Run Docker Container](#2-run-docker-container)
  - [3. Verify & Inspect Logs](#3-verify--inspect-logs)
  - [4. Stop and Remove Container](#4-stop-and-remove-container)
  - [5. Run with Docker Compose](#5-run-with-docker-compose)
- [🧪 Testing & Verification Report](#-testing--verification-report)
- [💻 Local Development Setup](#-local-development-setup-without-docker)
- [🔐 Environment Variables](#-environment-variables)
- [🎓 College Assignment Explanation](#-college-assignment-explanation-for-lecturer)

---

## 📖 Overview

The **Smart Campus Complaint Portal** allows students, faculty, and campus staff to report infrastructure, electrical, IT/WiFi, hostel, and safety concerns across campus. Featuring real-time complaint tracking, interactive 3D visualizations, and an administrative portal, this project has been fully containerized using Docker and Nginx.

---

## 📦 What Was Added (Dockerization & Enhancements)

To complete the **Docker-Based Web Application** assignment without modifying any core application functionality, the following production DevOps files and configurations were added:

1. **`Dockerfile` (Multi-Stage Production Build)**:
   - **Stage 1 (`builder`)**: Uses `node:20-alpine`, runs `npm ci` with the frozen lockfile, and builds the production bundle into `/app/dist`.
   - **Stage 2 (`runner`)**: Uses `nginx:alpine` (~40MB minimal footprint), copies the compiled distribution files, sets up an automated HTTP healthcheck, and runs Nginx in the foreground.

2. **`nginx.conf` (Custom Nginx Web Server Configuration)**:
   - **SPA Fallback Routing**: Configured `try_files $uri $uri/ /index.html;` so navigating directly or refreshing routes (`/about`, `/submit`, `/track`, `/support`, `/admin/login`) never throws a 404 error.
   - **Gzip Compression**: Pre-compresses HTML, CSS, JS, JSON, and SVG assets for optimal bandwidth and fast load times.
   - **Security Headers**: Injects `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and `Referrer-Policy`.
   - **Asset Caching**: Sets 1-year immutable caching on hashed build assets and `no-cache` on `index.html`.

3. **`.dockerignore`**:
   - Excludes `node_modules`, `dist`, `.git`, `.env*`, editor configs (`.vscode`, `.idea`, `.claude`), and logs to keep Docker build context ultra-light and prevent leaking secrets.

4. **`docker-compose.yml`**:
   - Orchestrates the application container with port forwarding `8080:80`, `restart: unless-stopped`, and continuous container health monitoring (`wget -qO- http://localhost:80/ || exit 1`).

5. **Updated Git Configuration (`.gitignore`)**:
   - Updated to ensure clean commits excluding unnecessary IDE cache and metadata files.

6. **Comprehensive Documentation & Testing**:
   - End-to-end production build and route verification tests.
   - Complete guides for building, running, and managing containers.

---

## ✨ Application Features

- **Issue Submission**: File new complaints with category tags (Hostel, Academic, IT/WiFi, Infrastructure, Canteen), urgency levels, and location markers.
- **Complaint Tracking**: Search and trace tickets via unique Complaint ID with status badges (`Pending`, `In Progress`, `Resolved`).
- **Administrative Portal**: Secure admin authentication interface for maintenance staff to review and update complaint statuses.
- **Interactive 3D Elements**: Powered by Three.js and React Three Fiber for campus visualization.
- **Accessible & Responsive**: Fully responsive UI supporting both desktop and mobile screens with smooth transitions (Framer Motion).
- **Single Page Application (SPA) Routing**: Seamless client-side navigation with fallback Nginx routing for direct URL access and page refreshes.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (`^19.2.7`) |
| **Language** | TypeScript (`~6.0.2`) |
| **Routing** | React Router DOM (`^7.18.2`) |
| **Build Tool & Bundler** | Vite 8 (`^8.1.1`) |
| **Styling** | Tailwind CSS v4 (`^4.3.3`) |
| **3D & Animation** | Three.js, React Three Fiber, Framer Motion |
| **Containerization** | Docker (Multi-stage build) |
| **Web Server** | Nginx Alpine (Reverse proxy & static SPA server) |
| **Orchestration** | Docker Compose |

---

## 📁 Project Folder Structure

```text
Student-campus/
├── .dockerignore              # Excludes unnecessary files from Docker build context
├── .gitignore                 # Git ignore rules
├── .oxlintrc.json             # Linter configuration
├── docker-compose.yml         # Docker Compose service definition
├── Dockerfile                 # Multi-stage production build configuration
├── index.html                 # HTML template
├── nginx.conf                 # Production Nginx reverse-proxy & SPA fallback configuration
├── package.json               # Project dependencies and npm scripts
├── package-lock.json          # Deterministic dependency lockfile
├── public/                    # Public static assets (favicon, images)
│   └── favicon.svg
├── README.md                  # Comprehensive project documentation
├── src/                       # Application source code
│   ├── App.tsx                # Main router and motion configuration
│   ├── index.css              # Global styles and Tailwind imports
│   ├── main.tsx               # Application entry point
│   ├── components/            # Reusable UI components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero3D.tsx         # 3D canvas experience
│   │   ├── icons.tsx
│   │   ├── Layout.tsx
│   │   ├── Logo.tsx
│   │   ├── Photo.tsx
│   │   ├── Reveal.tsx
│   │   └── StatusBadge.tsx
│   ├── data/                  # Complaint stores and photo references
│   │   ├── mockData.ts
│   │   └── photos.ts
│   └── pages/                 # View routes
│       ├── About.tsx
│       ├── AdminLogin.tsx
│       ├── Home.tsx
│       ├── Submit.tsx
│       ├── Support.tsx
│       └── Track.tsx
├── tsconfig.app.json          # TypeScript frontend configuration
├── tsconfig.json              # TypeScript root project configuration
├── tsconfig.node.json         # TypeScript Node configuration
└── vite.config.ts             # Vite configuration with React & Tailwind plugins
```

---

## ⚙️ Prerequisites

To run this application locally using Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS / Linux)
- [Git](https://git-scm.com/)

*(Optional for local non-Docker development: Node.js 20+ and npm 10+)*

---

## 🐳 Docker Installation Guide

If Docker is not yet installed on your system:

### Windows:
1. Download **Docker Desktop for Windows** from [Docker Hub](https://www.docker.com/products/docker-desktop/).
2. Enable **WSL 2** (Windows Subsystem for Linux) during installation:
   ```powershell
   wsl --install
   ```
3. Complete the Docker Desktop installation and restart your computer.
4. Launch Docker Desktop and wait for the engine status indicator to turn green.
5. Verify in PowerShell:
   ```powershell
   docker --version
   docker compose version
   ```

### macOS:
1. Download **Docker Desktop for Mac** (Apple Silicon or Intel).
2. Drag Docker to the Applications folder and launch it.
3. Verify in Terminal:
   ```bash
   docker --version
   ```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

---

## 🚀 Docker Setup & Usage

### 1. Build Docker Image

Build the optimized multi-stage production Docker image:

```bash
docker build -t smart-campus-complaint .
```

Verify that the image was created:

```bash
docker images
```

### 2. Run Docker Container

Run the container in detached mode, mapping host port `8080` to container port `80`:

```bash
docker run -d -p 8080:80 --name smart-campus-container smart-campus-complaint
```

### 3. Verify & Inspect Logs

Check if the container is running and healthy:

```bash
docker ps
```

View application access and startup logs:

```bash
docker logs smart-campus-container
```

Follow logs continuously:

```bash
docker logs -f smart-campus-container
```

Once running, access the portal in your browser:
👉 **[http://localhost:8080](http://localhost:8080)**

### 4. Stop and Remove Container

To stop the running container:

```bash
docker stop smart-campus-container
```

To remove the container:

```bash
docker rm smart-campus-container
```

To remove the Docker image:

```bash
docker rmi smart-campus-complaint
```

### 5. Run with Docker Compose

You can also orchestrate the application using Docker Compose with a single command:

**Start the container:**
```bash
docker compose up -d --build
```

**View running services:**
```bash
docker compose ps
```

**View service logs:**
```bash
docker compose logs -f
```

**Stop and clean up containers:**
```bash
docker compose down
```

---

## 🧪 Testing & Verification Report

The application was tested across production compilation and routing functionality:

| Test Case | Target | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **Production Build** | `npm run build` | Clean TypeScript check & Vite minification | Built in 1.82s into `dist/` | **PASS** |
| **Homepage Route** | `GET /` | Returns HTTP 200 with HTML shell | HTTP 200 OK | **PASS** |
| **About Page Route** | `GET /about` | Returns HTTP 200 without 404 | HTTP 200 OK | **PASS** |
| **Submit Complaint Route** | `GET /submit` | Returns HTTP 200 without 404 | HTTP 200 OK | **PASS** |
| **Track Complaint Route** | `GET /track` | Returns HTTP 200 without 404 | HTTP 200 OK | **PASS** |
| **Support Page Route** | `GET /support` | Returns HTTP 200 without 404 | HTTP 200 OK | **PASS** |
| **Admin Login Route** | `GET /admin/login` | Returns HTTP 200 without 404 | HTTP 200 OK | **PASS** |
| **Static Assets** | `GET /favicon.svg` | SVG asset loads properly | HTTP 200 OK | **PASS** |

---

## 💻 Local Development Setup (Without Docker)

To run the application natively in development mode:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:5173`.

4. Build for production locally:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 🔐 Environment Variables

The application is structured to operate with zero-configuration out of the box using client-side models. For optional third-party telemetry, backend endpoints, or analytics:

1. Create a `.env.local` file in the project root:
   ```env
   # Optional: Custom backend API base URL
   VITE_API_BASE_URL=
   ```
2. Note: All sensitive secrets and `.env` files are excluded from Docker builds via `.dockerignore` to adhere to standard DevOps security best practices.

---

## 🎓 College Assignment Explanation (For Lecturer)

Here is a breakdown of the 5 core assignment requirements:

1. **Web Application**: The Smart Campus Complaint Portal, a complete React 19 + TypeScript + Tailwind CSS application providing complaint registration, status tracking, 3D visualization, and admin login.
2. **Dockerfile**: A multi-stage Docker build separating the compilation phase (Node.js 20 Alpine) from the runtime phase (Nginx Alpine) to ensure maximum performance and minimal image size.
3. **Docker Image**: The packaged immutable artifact `smart-campus-complaint` containing the pre-compiled static assets and configured Nginx server.
4. **Docker Container**: The running instance `smart-campus-container` running on host port `8080`, configured with healthchecks and SPA fallback routing.
5. **GitHub Repository**: The repository ([https://github.com/Nishanth2434/Smart-campus-complaint](https://github.com/Nishanth2434/Smart-campus-complaint)) containing all source code, Docker configs, Nginx setup, Docker Compose file, and documentation.
