# Email Deliverability Analyzer

A comprehensive platform to test, monitor, and improve email deliverability through SPF, DKIM, DMARC validation, blacklist monitoring, and more.

## Features

- **Authentication Verification**: SPF, DKIM, DMARC validation
- **Infrastructure Health**: SMTP, DNS, SSL/TLS testing
- **Reputation Monitoring**: Multi-provider blacklist checking
- **Content Analysis**: Spam scores and HTML validation
- **Real-time Monitoring**: Dashboard with alerts and notifications
- **REST API**: Full API for integrations

## Tech Stack

### Backend
- Node.js 18+ with Express.js
- PostgreSQL 15+ database
- Redis 7+ for caching
- JWT authentication

### Frontend
- React 18+ with Vite
- Tailwind CSS
- Recharts for visualization
- Zustand for state management

### Infrastructure
- Docker & Docker Compose
- Kubernetes ready
- Nginx reverse proxy

## Quick Start

### Prerequisites

- Node.js 18+ or Docker
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd email-deliverability-analyzer

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Option 2: Local Development

```bash
# Install backend dependencies
cd backend
npm install
cp .env.example .env
npm run dev

# In a new terminal, install frontend dependencies
cd frontend
npm install
npm run dev
```

## Project Structure

```
email-deliverability-analyzer/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic (SPF, DKIM, DMARC)
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   └── tests/               # Backend tests
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   └── styles/          # CSS files
│   └── public/              # Static assets
├── database/                # Database scripts
│   ├── migrations/          # SQL migration files
│   └── schemas/             # Database schemas
├── docker/                  # Docker configuration
└── docs/                    # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Domains
- `GET /api/domains` - List domains
- `POST /api/domains` - Add domain
- `GET /api/domains/:id` - Get domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain
- `POST /api/domains/:id/verify` - Verify domain

### Tests
- `POST /api/tests/spf` - Run SPF test
- `POST /api/tests/dkim` - Run DKIM test
- `POST /api/tests/dmarc` - Run DMARC test
- `POST /api/tests/smtp` - Run SMTP test
- `POST /api/tests/blacklist` - Run blacklist test
- `GET /api/tests/results` - List test results
- `GET /api/tests/results/:id` - Get test result

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Migrations

Migrations are automatically applied when using Docker. For local development:

```bash
psql -U postgres -d email_deliverability -f database/migrations/001_create_users_table.sql
psql -U postgres -d email_deliverability -f database/migrations/002_create_domains_table.sql
psql -U postgres -d email_deliverability -f database/migrations/003_create_test_results_table.sql
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `PORT` - Backend port (default: 3001)
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT tokens
- `REDIS_HOST` - Redis host

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

### Phase 1 (Months 1-2) - MVP
- [x] Authentication system
- [x] SPF/DKIM/DMARC validators
- [x] Basic dashboard
- [x] Core REST API

### Phase 2 (Months 3-4) - Core Features
- [ ] SMTP testing
- [ ] Blacklist monitoring (50+ providers)
- [ ] Content analysis
- [ ] Alert system

### Phase 3 (Months 5-6) - Advanced
- [ ] Header analysis
- [ ] Inbox placement testing
- [ ] Integrations (Slack, PagerDuty)
- [ ] CI/CD support

### Phase 4 (Months 7-8) - Production
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Kubernetes deployment
- [ ] Community launch
