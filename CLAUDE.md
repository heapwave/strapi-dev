# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Strapi 5** headless CMS project with custom API endpoints. It uses MySQL (production) or SQLite (development) as the database, Aliyun OSS for file storage, and nodemailer for emails.

## Commands

```bash
npm run develop   # Start Strapi with autoReload enabled (development)
npm run build     # Build admin panel for production
npm run start     # Start Strapi without autoReload (production)
npm run deploy    # Deploy to Strapi Cloud
npm run seed:example  # Run seed script to populate initial data
```

## Architecture

### Content Type APIs (`src/api/`)

Each API follows Strapi's controller-service-router pattern:
- `controllers/` - Request handling (uses `createCoreController`)
- `services/` - Business logic (uses `createCoreService`)
- `routes/` - URL routing (uses `createCoreRouter`)

**Available APIs**: `about`, `global`, `idea`

### Custom `idea` Controller Logic

The `idea` controller has custom authentication and filtering:
- `find()` - Filters results to only return ideas belonging to the authenticated user
- `create()` - Auto-associates the authenticated user and publishes immediately

Uses Strapi v5 Document Service API (`strapi.documents()`) instead of deprecated `strapi.entityService()`.

### Configuration

| File | Purpose |
|------|---------|
| `config/database.js` | Database connection (MySQL/SQLite via env) |
| `config/plugins.js` | Upload (Aliyun OSS) and email (nodemailer) providers |
| `config/server.js` | Server host/port settings |
| `ecosystem.config.js` | PM2 configuration for production |

### Environment Variables

Uses three env files: `.env` (dev), `.env.prod` (production). Key variables:
- `DATABASE_CLIENT` - `mysql` or `sqlite`
- `OSS_*` - Aliyun OSS configuration for file uploads
- `SMTP_*` - Email configuration
