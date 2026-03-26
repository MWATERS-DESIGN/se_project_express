# WTWR (What to Wear?) — Back End

Weather Clothing Items API — a compact RESTful backend that manages clothing items by weather, lets users create items, and like/unlike items. Built with Node.js, Express and MongoDB (Mongoose).

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- validator
- Postman (recommended for testing)

## Features

- Create clothing items (name, weather, imageUrl)
- Retrieve all clothing items
- Like and remove likes from items
- Input validation and standardized error handling (400 / 404 / 500)
- Temporary authorization middleware to associate items with a user
- RESTful endpoints designed for front-end consumption

## Quick start

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Start (development):
   ```bash
   npm run dev
   ```
3. Start (production):
   ```bash
   npm run start
   ```

## API (summary)

## Authentication

Authentication(public)

- POST /signup
  Create a new user
  Body:

{
"name": "Alice",
"avatar": "https://..."
}

- POST /signin
  Authenticate a user and return a token
  Body: (example)

{
"email": "alice@example.com",
"password": "password123"
}

Users(protected)

- GET /users/me
  Get the currently authenticated user's profile
  (Requires authentication)

- PATCH /users/me
  Update the current user's profile
  (Requires authentication)
  Body:

{
"name": "Alice",
"avatar": "https://..."
}

Items

- GET /items
  Get all items
  (Public endpoint — no authentication required)

- POST /items
  Create a new item
  (Requires authentication)
  Body:

{
"name": "Jacket",
"weather": "cold",
"imageUrl": "https://..."
}

- DELETE /items/
  Delete an item by ID
  (Requires authentication)
- PUT /items//likes
  Like an item
  (Requires authentication)
- DELETE /items//likes
  Remove like from an item
  (Requires authentication)

## Notes

- All routes except GET /items require authentication via a valid token.
- The previously documented endpoints (GET /users, GET /users/:userId, POST /users) are no longer supported and will return errors.
