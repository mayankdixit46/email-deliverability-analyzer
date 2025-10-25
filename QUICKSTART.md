# Quick Start - Email Deliverability Analyzer

## 30-Second Start (Docker)

```bash
cd /Users/mayankdixit/email-deliverability-analyzer
docker-compose up -d
```

Then open: http://localhost:3000

## 2-Minute Start (Local Dev)

**Terminal 1:**
```bash
cd /Users/mayankdixit/email-deliverability-analyzer/backend
npm run dev
```

**Terminal 2:**
```bash
cd /Users/mayankdixit/email-deliverability-analyzer/frontend
npm run dev
```

## Project Location

```
/Users/mayankdixit/email-deliverability-analyzer
```

## What's Included

✅ Complete Backend API (Express + PostgreSQL + Redis)
✅ Complete Frontend (React + Vite + Tailwind)
✅ SPF/DKIM/DMARC Validation Services
✅ User Authentication
✅ Domain Management
✅ Test Execution & Results
✅ Docker Setup
✅ Database Migrations
✅ Dependencies Installed

## First Use

1. Open http://localhost:3000
2. Click "Register"
3. Create your account
4. Add a domain
5. Run tests!

## Common Commands

```bash
# Docker
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose ps             # Check status

# Backend
cd backend
npm run dev                   # Development
npm test                      # Run tests

# Frontend
cd frontend
npm run dev                   # Development
npm run build                 # Production build

# Git
git status                    # Check status
git log                       # View commits
```

## Need Help?

- Read: [README.md](README.md)
- Detailed guide: [GETTING_STARTED.md](GETTING_STARTED.md)
- Full summary: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

---

**You're all set!** Start developing your email deliverability analyzer.
