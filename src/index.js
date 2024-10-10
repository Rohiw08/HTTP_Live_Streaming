import http from 'http';
import { app } from "./app.js";
import { createWebSocketServer } from "./websocket.js";
import 'dotenv/config';
import connectDB from './db/index.js'; // Assuming you have a db.js file with connectDB function

const server = http.createServer(app);

// Initialize WebSocket server
createWebSocketServer(server);

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });