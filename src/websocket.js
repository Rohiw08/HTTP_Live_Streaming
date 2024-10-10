import WebSocket, { WebSocketServer } from "ws";
import url from 'url';

const rooms = {};

const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        const baseURL = 'ws://' + request.headers.host + '/';
        const { pathname, query } = url.parse(request.url, true);
        
        if (pathname === '/meeting') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request, query);
            });
        } else {
            socket.destroy();
        }
    });

    const broadcastToRoom = (roomId, message, excludeUserId = null) => {
        if (rooms[roomId]) {
            rooms[roomId].clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client.userId !== excludeUserId) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    };

    const updateRoomTimeline = (roomId) => {
        if (rooms[roomId] && rooms[roomId].isPlaying) {
            rooms[roomId].currentTime += 1;  // Increment by 1 second
        }
    };

    const checkAndSyncRoom = (roomId) => {
        if (rooms[roomId]) {
            const { currentTime, isPlaying } = rooms[roomId];
            broadcastToRoom(roomId, {
                type: 'syncCheck',
                serverTime: currentTime,
                isPlaying: isPlaying
            });
        }
    };

    wss.on('connection', (ws, request, query) => {
        const { userId, roomId } = query;

        if (!userId || !roomId) {
            ws.close(1008, "Missing userId or roomId");
            return;
        }

        if (!rooms[roomId]) {
            rooms[roomId] = {
                clients: [],
                currentTime: 0,
                isPlaying: false,
                lastUpdateTime: Date.now(),
                videoLength: 0  // This should be set when the video is loaded
            };
        }

        ws.userId = userId;
        rooms[roomId].clients.push(ws);

        ws.send(JSON.stringify({
            type: 'joinConfirmation',
            message: `Joined room ${roomId}`,
            userId,
            roomId,
            currentTime: rooms[roomId].currentTime,
            isPlaying: rooms[roomId].isPlaying
        }));

        broadcastToRoom(roomId, {
            type: 'userJoined',
            userId,
            message: `User ${userId} joined the room`
        }, userId);

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                switch (data.type) {
                    case 'chat':
                        broadcastToRoom(roomId, {
                            type: 'chat',
                            userId,
                            message: data.message
                        });
                        break;
                    case 'playPause':
                        rooms[roomId].isPlaying = data.isPlaying;
                        if (data.isPlaying) {
                            rooms[roomId].lastUpdateTime = Date.now();
                        } else {
                            rooms[roomId].currentTime = data.currentTime;
                        }
                        broadcastToRoom(roomId, {
                            type: 'playPause',
                            userId,
                            isPlaying: data.isPlaying,
                            currentTime: rooms[roomId].currentTime
                        });
                        break;
                    case 'skip':
                        rooms[roomId].currentTime = Math.min(Math.max(0, data.currentTime), rooms[roomId].videoLength);
                        rooms[roomId].lastUpdateTime = Date.now();
                        broadcastToRoom(roomId, {
                            type: 'skip',
                            userId,
                            currentTime: rooms[roomId].currentTime
                        });
                        break;
                    case 'syncRequest':
                        ws.send(JSON.stringify({
                            type: 'syncResponse',
                            serverTime: rooms[roomId].currentTime,
                            isPlaying: rooms[roomId].isPlaying
                        }));
                        break;
                    case 'videoLoaded':
                        rooms[roomId].videoLength = data.videoLength;
                        break;
                    default:
                        throw new Error("Invalid message type");
                }
            } catch (error) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: error.message
                }));
            }
        });

        ws.on('close', () => {
            if (rooms[roomId]) {
                rooms[roomId].clients = rooms[roomId].clients.filter(client => client !== ws);
                if (rooms[roomId].clients.length === 0) {
                    delete rooms[roomId];
                } else {
                    broadcastToRoom(roomId, {
                        type: 'userLeft',
                        userId,
                        message: `User ${userId} left the room`
                    });
                }
            }
        });
    });

    // Start periodic timeline updates and sync checks
    setInterval(() => {
        Object.keys(rooms).forEach(roomId => {
            updateRoomTimeline(roomId);
            if (rooms[roomId].clients.length > 0) {
                checkAndSyncRoom(roomId);
            }
        });
    }, 1000); // Update every second
};

export { createWebSocketServer };