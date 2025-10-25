# Getting Started with Email Deliverability Analyzer

This guide will help you set up and run the Email Deliverability Analyzer project.

## Prerequisites

Choose one of the following options:

### Option A: Docker (Recommended)
- Docker Desktop or Docker Engine
- Docker Compose

### Option B: Local Development
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

## Setup Instructions

### Using Docker (Recommended)

1. **Navigate to project directory**
   ```bash
   cd email-deliverability-analyzer
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Check service status**
   ```bash
   docker-compose ps
   ```

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Using Local Development

#### 1. Set up PostgreSQL

```bash
# Create database
createdb email_deliverability

# Run migrations
psql -U postgres -d email_deliverability -f database/migrations/001_create_users_table.sql
psql -U postgres -d email_deliverability -f database/migrations/002_create_domains_table.sql
psql -U postgres -d email_deliverability -f database/migrations/003_create_test_results_table.sql
```

#### 2. Start Redis

```bash
# macOS with Homebrew
brew services start redis

# Linux
sudo systemctl start redis

# Or run in terminal
redis-server
```

#### 3. Set up Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

#### 4. Set up Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

## First Steps

### 1. Create an Account

1. Open http://localhost:3000
2. Click "Register"
3. Fill in your details
4. Click "Register"

### 2. Add Your First Domain

1. Navigate to "Domains" in the sidebar
2. Click "Add Domain"
3. Enter your domain name (e.g., example.com)
4. Add an optional description
5. Click "Add Domain"

### 3. Run Your First Test

1. Navigate to "Tests" in the sidebar
2. Select your domain from the dropdown
3. Click "Run Test" for SPF, DKIM, or DMARC
4. View the results below

## Project Structure

```
email-deliverability-analyzer/
├── backend/           # Express.js API server
├── frontend/          # React + Vite frontend
├── database/          # SQL migrations and schemas
├── services/          # Microservices (future)
├── docker/            # Docker configuration
└── docs/              # Additional documentation
```

## Available Scripts

### Backend
```bash
npm run dev       # Start development server
npm start         # Start production server
npm test          # Run tests
npm run lint      # Run linter
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
docker-compose ps                 # Check service status
docker-compose restart backend    # Restart specific service
```

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
lsof -i :3000   # Frontend
lsof -i :3001   # Backend
lsof -i :5432   # PostgreSQL
lsof -i :6379   # Redis

# Kill the process
kill -9 <PID>
```

### Database Connection Errors

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   # or
   pg_isready
   ```

2. Verify credentials in `.env` file

3. Check migrations ran successfully:
   ```bash
   docker-compose logs postgres | grep "CREATE TABLE"
   ```

### Frontend Not Loading

1. Clear browser cache
2. Check backend is running at http://localhost:3001/health
3. Check console for errors (F12 in browser)

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Remove volumes (caution: deletes data)
docker-compose down -v
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload in development mode. Changes are automatically detected and the application reloads.

### Database Reset

To reset the database:

```bash
# Docker
docker-compose down -v
docker-compose up -d

# Local
dropdb email_deliverability
createdb email_deliverability
# Run migrations again
```

### Testing Email Authentication

To test SPF/DKIM/DMARC:

1. Add a domain you control
2. Make sure it has proper DNS records configured
3. Run tests from the Tests page
4. View detailed results and recommendations

## Next Steps

1. Read the main [README.md](README.md) for full documentation
2. Check out the [API documentation](docs/API.md) (coming soon)
3. Explore the codebase
4. Start building!

## Need Help?

- Check existing [GitHub Issues](../../issues)
- Create a new issue for bugs or features
- Read the [Contributing Guide](CONTRIBUTING.md)

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

Happy coding!
