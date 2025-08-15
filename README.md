# 📽️ Shottrace.com Project Roadmap

**Shottrace** is my personal project — a clone of [Letterboxd.com](https://letterboxd.com/), a social platform for film lovers.

---

## 🔧 Tech Stack

- **Backend:**
  - NestJS (Node.js framework)
  - Python (data processing)
- **Frontend:**
  - React

---

### Work In Progress

#### Infrastructure & Auth
- [x] Authentication With Refresh Tokens
- [x] Create basic CI
- [x] API Documentation with Swagger
- [ ] Deploy to AWS
- [ ] Create CI/CD pipeline

#### Core Pages 
- [ ] Movies
- [ ] Individual Movie
- [ ] Home
- [ ] User
- [ ] Lists

# Starting the project

### Prerequisites
Before you start, make sure you have the following installed:
- [Docker](https://www.docker.com/get-started) 
> ⚠️ Ensure Docker is running before starting the project.

---

## Installation & Start

1. **Install backend & frontend dependencies**

```bash
npm run install      # Set up working environment   
npm run install:all  # Install both backend and frontend dependencies
```

2. **Start the development environment**

```bash
npm run start:dev:all  # Starts backend, frontend, and required services in dev mode
```
