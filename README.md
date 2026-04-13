# CodeBuddy AI

AI-powered coding mentor for developers.

CodeBuddy AI is a full-stack developer learning platform that analyzes Python code, explains syntax issues, estimates time complexity, reviews common patterns, inspects GitHub repositories, and stores learning history for progress tracking.

## Why this project stands out

- Clean separation between API views, serializers, and service-layer logic.
- Django REST Framework backend with environment-based settings and PostgreSQL-ready configuration.
- Vanilla HTML/CSS/JavaScript frontend that talks to the backend through `fetch()`.
- Docker and Docker Compose support for local development and interview demos.
- Database-backed history endpoint that showcases persistence and product thinking.

## Tech stack

- Frontend: HTML, CSS, Vanilla JavaScript, Fetch API
- Backend: Python, Django, Django REST Framework
- Database: SQLite for development, PostgreSQL via `DATABASE_URL`
- External API: GitHub REST API
- Libraries: `requests`, `ast`, `django-cors-headers`

## Project structure

```text
C:\code_buddy_AI
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend
│   └── codebuddy_backend
│       ├── manage.py
│       ├── db.sqlite3
│       ├── requirements.txt
│       ├── Dockerfile
│       ├── analyzer
│       │   ├── api_views.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── services
│       │   │   ├── code_analysis.py
│       │   │   └── github_service.py
│       │   ├── urls.py
│       │   ├── views.py
│       │   └── tests.py
│       └── codebuddy_backend
│           ├── settings.py
│           ├── urls.py
│           ├── wsgi.py
│           └── asgi.py
├── docs
│   ├── api-examples.md
│   └── architecture.md
└── docker-compose.yml
```

## Core features

### 1. AI Code Error Explainer

- Uses Python `compile(code, "<string>", "exec")` to detect syntax issues.
- Maps common syntax failures to readable explanations and suggested fixes.

### 2. Code Complexity Analyzer

- Parses Python code with `ast`.
- Estimates complexity based on maximum loop nesting depth.
- Examples:
  - No loops -> `O(1)`
  - One loop -> `O(n)`
  - Nested loops -> `O(n^2)`

### 3. Code Reviewer

- Suggests improvements for:
  - `range(len(...))` iteration
  - `.append()` inside loops
  - direct comparisons with `True` or `False`

### 4. GitHub Repository Analyzer

- Accepts a GitHub repository URL.
- Extracts owner and repo name.
- Calls the GitHub REST API and returns:
  - name
  - owner
  - language
  - stars

### 5. Learning Progress Tracker

- Stores every code analysis in the `AnalysisHistory` model.
- Exposes a history endpoint used by the frontend progress panel.

## API endpoints

- `POST /api/analyze-code`
- `POST /api/github-analyze`
- `GET /api/history`

Detailed examples live in [docs/api-examples.md](docs/api-examples.md).

## Local setup

### Backend

```powershell
cd C:\code_buddy_AI\backend\codebuddy_backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

If an old local `db.sqlite3` file throws a SQLite disk I/O error, remove or rename that file and run `python manage.py migrate` again to generate a fresh development database.

### Frontend

Option 1: open [frontend/index.html](frontend/index.html) directly in a browser.

Option 2: serve it locally:

```powershell
cd C:\code_buddy_AI\frontend
python -m http.server 5500
```

Frontend runs at `http://127.0.0.1:5500`.

## Docker setup

```powershell
cd C:\code_buddy_AI
docker compose up --build
```

This starts:

- API on `http://127.0.0.1:8000`
- Frontend on `http://127.0.0.1:8080`
- PostgreSQL on port `5432`

## Environment variables

Use [backend/codebuddy_backend/.env.example](backend/codebuddy_backend/.env.example) as the template.

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL`
- `GITHUB_TOKEN`
- `CORS_ALLOWED_ORIGINS`

## Example response

### Analyze code

Request:

```json
{
  "code": "for i in range(10)\n    print(i)"
}
```

Response:

```json
{
  "error": "SyntaxError",
  "explanation": "Missing colon after the for loop declaration.",
  "fix": "Add ':' after the statement that opens the block.",
  "complexity": "Not available",
  "suggestions": []
}
```

### Analyze GitHub repository

Request:

```json
{
  "url": "https://github.com/django/django"
}
```

Response:

```json
{
  "name": "django",
  "owner": "django",
  "language": "Python",
  "stars": 82000
}
```

## Interview talking points

- Service-layer design for code analysis and GitHub integrations.
- API contracts validated with DRF serializers.
- Environment-driven deployment setup with SQLite and PostgreSQL support.
- Static frontend that remains framework-free while still feeling product-ready.
- Test coverage for syntax analysis, complexity estimation, history tracking, and GitHub metadata lookup.
