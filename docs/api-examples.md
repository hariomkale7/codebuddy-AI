# API Examples

## POST `/api/analyze-code`

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

Valid-code example:

```json
{
  "code": "for i in range(len(items)):\n    print(items[i])"
}
```

```json
{
  "error": null,
  "explanation": "No syntax errors detected. Your code is ready for review.",
  "fix": "No syntax fix is required.",
  "complexity": "O(n)",
  "suggestions": [
    "Iterate directly over the list instead of using range(len(...)) when you do not need the index."
  ]
}
```

## POST `/api/github-analyze`

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

## GET `/api/history`

Response:

```json
[
  {
    "id": 12,
    "code": "for i in range(len(items)):\n    print(items[i])",
    "code_preview": "for i in range(len(items)):",
    "error": "",
    "complexity": "O(n)",
    "created_at": "2026-04-13T18:44:08.821112Z"
  }
]
```
