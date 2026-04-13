# CodeBuddy AI Architecture

## System overview

CodeBuddy AI is a lightweight full-stack developer tool composed of a static frontend and a RESTful Django backend.

```text
Browser UI
    |
    v
Vanilla JS + Fetch API
    |
    v
Django REST Framework API
    |
    +--> Python analysis service (compile + ast)
    |
    +--> GitHub metadata service (requests)
    |
    +--> SQLite / PostgreSQL persistence
```

## Backend design

### Presentation layer

- `analyzer/api_views.py`
- Accepts requests, validates payloads, orchestrates services, and returns JSON responses.

### Validation layer

- `analyzer/serializers.py`
- Ensures inputs are shaped correctly before they reach business logic.

### Service layer

- `analyzer/services/code_analysis.py`
- `analyzer/services/github_service.py`

This layer contains the reusable business logic:

- syntax validation with `compile()`
- complexity estimation with `ast`
- code review heuristics
- GitHub API integration

### Persistence layer

- `analyzer/models.py`
- `AnalysisHistory` stores code analysis events for the learning tracker.

## Frontend design

The frontend is intentionally framework-free to show strong fundamentals:

- `index.html` defines a dashboard-style developer workflow
- `style.css` provides a polished responsive visual design
- `script.js` handles `fetch()` requests, loading states, rendering, and history refreshes

## Deployment readiness

- Local development defaults to SQLite
- Production can switch to PostgreSQL through `DATABASE_URL`
- `Dockerfile` packages the Django backend with Gunicorn
- `docker-compose.yml` provisions API, PostgreSQL, and a static frontend preview
- Settings are environment-driven for easier AWS deployment

## AWS-ready considerations

- Gunicorn-compatible WSGI entrypoint
- Proxy-aware HTTPS header configuration
- Environment-based secrets and host lists
- PostgreSQL-ready settings for RDS or managed Postgres
- Static frontend can be served from S3/CloudFront or Nginx
