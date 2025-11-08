# Pixelfont Server

This is the Node.js server that receives and manages font contexts from connected clients.

## Features

- **Persistent Storage**: Uses SQLite database for reliable data storage
- **Automatic Cleanup**: Removes font entries older than 24 hours
- **Unique User Tracking**: Uses UUID-based userId (users can change display names)
- **CORS Enabled**: Allows client access from any origin
- **Docker Ready**: Includes Docker and docker-compose configuration
- **Health Checks**: Built-in health monitoring endpoint

## Installation

### Local Development

```bash
cd server
npm install
```

### Docker Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed Coolify deployment instructions.

## Running the Server

### Development Mode

```bash
npm run dev
```

Runs with auto-reload on file changes.

### Production Mode

```bash
npm start
```

### Docker

```bash
docker-compose up -d
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - Path to SQLite database file (default: `./data/fonts.db`)

### Local Development Example

```bash
export PORT=3001
export DB_PATH=./data/fonts.db
npm start
```

## API Endpoints

### POST /api/fonts

Receives font data from clients.

**Request Body:**

```json
{
  "userId": "uuid-v4-string",
  "author": "User Display Name",
  "fontData": { ... }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Font data received",
  "userId": "uuid-v4-string",
  "author": "User Display Name"
}
```

### GET /api/fonts

Returns all stored fonts with their metadata, ordered by most recent first.

**Response:**

```json
[
  {
    "userId": "uuid-v4-string",
    "author": "User Display Name",
    "lastUpdate": 1699459200000,
    "fontData": { ... }
  }
]
```

### GET /api/fonts/:userId

Returns font data for a specific user by their UUID.

**Response:**

```json
{
  "userId": "uuid-v4-string",
  "author": "User Display Name",
  "lastUpdate": 1699459200000,
  "fontData": { ... }
}
```

### GET /api/health

Health check endpoint for monitoring.

**Response:**

```json
{
  "status": "ok",
  "timestamp": 1699459200000
}
```

## Database Schema

The SQLite database uses the following schema:

```sql
CREATE TABLE fonts (
  userId TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  lastUpdate INTEGER NOT NULL,
  fontData TEXT NOT NULL
);

CREATE INDEX idx_lastUpdate ON fonts(lastUpdate);
```

## Data Persistence

- **Local Development**: Database stored in `./data/fonts.db`
- **Docker**: Database stored in mounted volume at `/app/data/fonts.db`
- **Production**: Mounted from host at `/DATA/pixelfont/db/data`

## Maintenance

### Automatic Cleanup

The server automatically deletes font entries older than 24 hours, running cleanup every 5 minutes.

### Manual Database Access

```bash
# Local
sqlite3 data/fonts.db

# Docker
docker exec -it pixelfont-server sqlite3 /app/data/fonts.db
```

### Database Backup

```bash
# Local
cp data/fonts.db data/fonts.db.backup

# Docker
docker exec pixelfont-server sqlite3 /app/data/fonts.db ".backup '/app/data/fonts.db.backup'"
```

## Deployment

For production deployment with Coolify, see [DEPLOY.md](./DEPLOY.md).

## Technology Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Containerization**: Docker
