# Game Forum REST API

A REST API backend for the Game Forum application built with Node.js, Express, and MongoDB.
[game-forum](https://github.com/BaiToshoo/game-forum)

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14+)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

## Getting Started

### Step 1: Clone and Install
```bash
git clone https://github.com/BaiToshoo/game-forum-api.git
cd game-forum-api
npm install
```

### Step 2: Start Local Development
```bash
npm run dev:local
```
This will automatically:
- Start MongoDB containers
- Wait for database to be ready
- Start the API server

### Step 3: Load Sample Data
```bash
# Open a new terminal and run:
mongorestore --host localhost:27017 --db game-forum ./backup/game-forum
```
This loads sample themes, posts, and a test user from the backup folder.

### Step 4: Test the API
- **View MongoDB:** http://localhost:8081 (admin/admin123)
- **Get all themes:** http://localhost:3000/api/themes
- **Get all posts:** http://localhost:3000/api/posts

✅ **Your API is now running at:** http://localhost:3000/api

### Alternative: Production Testing
```bash
npm run dev:atlas
```
This connects to the production database (MongoDB Atlas) for testing.

## What You Get

After loading the sample data, you'll have:
- **Test User:** (test@gmail.com/test123)
- **Themes:** Gaming discussion topics
- **Posts:** Comments and discussions in themes

## Features

- User registration and authentication
- Create and browse gaming discussion themes  
- Post comments in themes
- Like/unlike posts
- User profiles and subscriptions

## Useful Commands

```bash
# Load sample data into local database
mongorestore --host localhost:27017 --db game-forum ./backup/game-forum

# Stop containers
npm run docker:down

# Remove all data and start fresh
npm run docker:down
docker volume rm game-forum-api_mongodb_data

# View running containers
docker ps
```

## Production Version

Live API: https://game-forum-api.vercel.app/api

## Related Projects

- **Frontend:** [game-forum](https://github.com/BaiToshoo/game-forum) - Angular frontend
