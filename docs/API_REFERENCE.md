# API Reference

Base URL (local): `http://localhost:5000/api/v1`

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": []
}
```

---

## Health Endpoints

### `GET /api/v1/health`

Application liveness check. Returns immediately without database access.

**Response 200:**
```json
{
  "success": true,
  "message": "Application is running.",
  "data": {
    "status": "ok",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "uptime": 42
  }
}
```

---

### `GET /api/v1/health/ready`

Readiness check. Verifies the database is reachable.

**Response 200 — database connected:**
```json
{
  "success": true,
  "message": "Application is ready to serve traffic.",
  "data": {
    "status": "ready",
    "database": "connected",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

**Response 503 — database unavailable:**
```json
{
  "success": false,
  "message": "Database is not reachable. The application is not ready.",
  "errors": []
}
```

---

## Example Records

### `GET /api/v1/examples`

List all example records with pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number (min 1) |
| `limit` | integer | `10` | Records per page (max 100) |
| `status` | string | — | Filter by status: `active`, `inactive`, `archived` |

**Response 200:**
```json
{
  "success": true,
  "message": "Records retrieved successfully.",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "First Record",
        "description": "An example description.",
        "status": "active",
        "createdAt": "2025-01-01T12:00:00.000Z",
        "updatedAt": "2025-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 3,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10
    }
  }
}
```

---

### `GET /api/v1/examples/:id`

Get a single record by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | Record ID |

**Response 200:**
```json
{
  "success": true,
  "message": "Record retrieved successfully.",
  "data": {
    "id": 1,
    "title": "First Record",
    "description": "An example description.",
    "status": "active",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Example record not found.",
  "errors": []
}
```

---

### `POST /api/v1/examples`

Create a new record.

**Request Body:**
```json
{
  "title": "My New Record",
  "description": "Optional description text.",
  "status": "active"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | 1–255 characters |
| `description` | string\|null | No | Max 5000 characters |
| `status` | string | No | `active` (default), `inactive`, `archived` |

**Response 201:**
```json
{
  "success": true,
  "message": "Record created successfully.",
  "data": {
    "id": 4,
    "title": "My New Record",
    "description": "Optional description text.",
    "status": "active",
    "createdAt": "2025-01-01T12:01:00.000Z",
    "updatedAt": "2025-01-01T12:01:00.000Z"
  }
}
```

**Response 422 (validation error):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "title", "message": "Title must not be empty." }
  ]
}
```

---

### `PATCH /api/v1/examples/:id`

Partially update a record. Send only the fields you want to change.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "status": "inactive"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Record updated successfully.",
  "data": { ... }
}
```

---

### `DELETE /api/v1/examples/:id`

Delete a record.

**Response 204:** No body.

**Response 404:**
```json
{
  "success": false,
  "message": "Example record not found.",
  "errors": []
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict (unique constraint) |
| 422 | Unprocessable Entity (validation failed) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
