# MERN Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features

- Real-time messaging using Socket.io
- User threads/conversations
- Message history
- Online status tracking
- RESTful API endpoints

## Project Structure

```
mern/
├── public/
│   └── index.html          # Simple chat UI
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   └── chat.controller.js  # Chat logic
│   ├── middleware/
│   │   └── error.middleware.js # Error handling
│   ├── models/
│   │   ├── chat.model.js   # Chat message schema
│   │   ├── thread.model.js # Thread schema
│   │   └── user.model.js   # User schema
│   ├── routes/
│   │   └── chat.routes.js  # API routes
│   ├── sockets/
│   │   └── socket.js       # Socket.io setup
│   ├── utils/
│   │   └── asyncHandler.js # Async wrapper
│   └── server.js           # Main server file
├── .env                    # Environment variables
├── .gitignore
└── package.json

```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup MongoDB (make sure MongoDB is running locally or update MONGO_URI in .env)

4. Run the server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Chat Routes (`/api/chat`)

- `POST /api/chat/send` - Send a message
  - Body: `{ sender, receiver, message }`

- `GET /api/chat/thread/:threadId` - Get messages in a thread

- `GET /api/chat/threads/:userId` - Get all threads for a user

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cms
JWT_SECRET=your_secret_key
```

## Socket Events

- `join` - User joins with their userId
- `new_message` - Emitted when a new message is received
- `disconnect` - User disconnects

## Usage

1. Open the chat UI at `http://localhost:5000`
2. Enter a Sender ID and Receiver ID
3. Click "Connect" to join the chat
4. Start sending messages!

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Real-time**: Socket.io
- **Frontend**: Vanilla JavaScript, HTML, CSS

## License

ISC
