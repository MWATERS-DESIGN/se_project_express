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

- Users
  - GET /users
  - GET /users/:userId
  - POST /users
    - body: { "name": "Alice", "avatar": "https://..." }
- Items
  - GET /items
  - POST /items
    - body: { "name": "Jacket", "weather": "cold", "imageUrl": "https://..." }
  - DELETE /items/:itemId
  - PUT /items/:itemId/likes
  - DELETE /items/:itemId/likes
