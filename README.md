# ⚖️ Load Balancer — Remote Application (Networking)

The **Load Balancer** microfrontend is part of the **Networking** service group.  
It is built with [React](https://react.dev/) and [Rsbuild](https://modernjs.dev/rsbuild) using [Module Federation](https://module-federation.io/).

This module integrates into the **Chrome Host application** and provides UI and functionality for managing Application LoadBalancer (ALB) based on Traefik reverse-proxy.

---

## 🚀 Overview

The **Load Balancer App** provides user-facing functionality for managing web routes, SSL certificates, and traffic routing for Application LoadBalancer gateways.  
It consumes shared components, hooks, and utilities exposed by the **Chrome Host Application**.

### 🔧 Features
- 🛣️ **Web Routes Management** — create, view, edit, and delete web routes that define traffic routing rules
- 🔒 **SSL Certificate Management** — upload, view, and manage SSL certificates for HTTPS termination
- 🌐 **Traffic Routing** — configure HTTP/HTTPS traffic routing from public IP addresses to backend services
- 🔄 **Load Balancing** — automatic round-robin load balancing across multiple backend instances
- 💓 **Health Checks** — configure and monitor health checks for backend services
- 🔐 **TLS Termination** — support for edge termination and re-encryption modes
- 📍 **Path-based Routing** — route traffic based on hostname and path patterns
- 🔗 **Gateway Configuration** — manage Application LoadBalancer gateways on Cloud Gateway instances
- 🔍 **Search & Filter** — filter web routes and certificates by search query
- 🔗 **Shared UI and logic** imported from the Host app
- 🧩 **Microfrontend integration** using Module Federation

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [React 18+](https://react.dev/) |
| Bundler | [Rsbuild](https://modernjs.dev/rsbuild) |
| Microfrontends | [Module Federation](https://module-federation.io/) |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) *(imported from Host)* |
| Forms | [react-hook-form](https://react-hook-form.com/) *(via Host hooks)* |
| Validation | [Zod](https://zod.dev/) *(via Host hooks)* |
| Data Fetching | [TanStack Query](https://tanstack.com/query/latest) *(via Host hooks)* |
| Global State | [Redux](https://redux.js.org/) *(via Host store)* |

---

## ⚠️ Important Note

> **This remote application cannot run independently.**  
> It must always be loaded and executed within the **Chrome Host application** context.  
> The Host provides authentication, global routing, shared UI components, and state management — all of which are required for Load Balancer to function properly.

---

## ⚙️ Installation & Local Development

### 1. Clone the repository

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Before starting the app, you need to create a local environment file.
Copy the example file:

```bash
cp .env.example .env.local
```
Open .env.local and provide valid values for all keys (API endpoints, etc.).

### 4. Start the development server
```bash
npm run dev
```

The app will be available at:
http://localhost:8018
