# Game Forum REST API

A REST API backend for the Game Forum application built with Node.js, Express, and MongoDB.

## Prerequisites

Before running this API, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd game-forum-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database with Docker

Start the MongoDB container with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- MongoDB on `http://localhost:27017`
- MongoDB Express (web interface) on `http://localhost:8081`

**Import test data (if you have existing data):**

```bash
# If you have a backup from local MongoDB
mongorestore --db game-forum ./backup/game-forum
```

### 4. Start the API

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

**To stop the database:**
```bash
docker-compose down
```

**To stop and remove all data:**
```bash
docker-compose down -v
```

## Base URL

```
http://localhost:3000/api
```

## Authentication

## Related Repositories

- **Frontend:** [game-forum](https://github.com/your-username/game-forum) - Angular frontend application
- **API:** [game-forum-api](https://github.com/your-username/game-forum-api) - This REST API backend

## License

This project is part of an educational course and is intended for learning purposes.
