# Game Forum REST API

A REST API backend for the Game Forum application built with Node.js, Express, and MongoDB.

## Prerequisites

Before running this API, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or MongoDB Atlas)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BaiToshoo/game-forum-api.git
cd game-forum-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
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
