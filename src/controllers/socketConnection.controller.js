// import express from express;
// import http from http;
// import WebSocket from 'ws';

// const app = express();

// // Create an HTTP server and pass it to WebSocket
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Object to store room info and client connections
// const rooms = {};

// // Function to broadcast a message to all clients in a room
// const broadcastToRoom = (roomId, message) => {
//   if (rooms[roomId]) {
//     rooms[roomId].forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   }
// };

// // When a client connects
// wss.on('connection', (ws) => {
//   let roomId = null;

//   // Listen for messages from the client
//   ws.on('message', (message) => {
//     const data = JSON.parse(message);

//     if (data.type === 'join') {
//       roomId = data.roomId;

//       // Create a new room if it doesn't exist
//       if (!rooms[roomId]) {
//         rooms[roomId] = [];
//       }

//       // Add client to the room
//       rooms[roomId].push(ws);
//       ws.send(`Joined room ${roomId}`);
//     } else if (data.type === 'message') {
//       // Broadcast message to everyone in the room
//       if (roomId) {
//         broadcastToRoom(roomId, data.message);
//       }
//     }
//   });

//   // Handle client disconnection
//   ws.on('close', () => {
//     if (roomId && rooms[roomId]) {
//       rooms[roomId] = rooms[roomId].filter(client => client !== ws);
//       if (rooms[roomId].length === 0) {
//         delete rooms[roomId];  // Remove room if it's empty
//       }
//     }
//   });
// });

// // Start the server
// server.listen(8080, () => {
//   console.log('Server is running on http://localhost:8080');
// });
