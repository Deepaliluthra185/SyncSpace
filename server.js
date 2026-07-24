require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/syncspace';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};
connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const roomUsers = new Map(); // roomId -> Map(userId -> UserData)

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('join-room', (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit('user-joined', data);

    if (!roomUsers.has(data.roomId)) {
      roomUsers.set(data.roomId, new Map());
    }
    
    const usersInRoom = roomUsers.get(data.roomId);
    usersInRoom.set(data.userId, {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      joinedAt: new Date(),
      socketId: socket.id
    });

    const activeUsers = Array.from(usersInRoom.values());
    io.to(data.roomId).emit('users-updated', { users: activeUsers });
  });

  socket.on('user-active', (data) => {
    socket.to(data.roomId).emit('user-active', data);
  });

  socket.on('leave-room', (data) => {
    socket.leave(data.roomId);
    socket.to(data.roomId).emit('user-left', data);

    const usersInRoom = roomUsers.get(data.roomId);
    if (usersInRoom) {
      usersInRoom.delete(data.userId);
      const activeUsers = Array.from(usersInRoom.values());
      io.to(data.roomId).emit('users-updated', { users: activeUsers });
    }
  });

  socket.on('code-change', (data) => {
    socket.to(data.roomId).emit('code-change', data);
  });

  socket.on('cursor-move', (data) => {
    socket.to(data.roomId).emit('cursor-move', data);
  });

  socket.on('whiteboard-update', (data) => {
    socket.to(data.roomId).emit('whiteboard-update', data);
  });
  
  socket.on('disconnect', () => {
    roomUsers.forEach((usersInRoom, roomId) => {
      let changed = false;
      for (const [userId, userData] of usersInRoom.entries()) {
        if (userData.socketId === socket.id) {
          usersInRoom.delete(userId);
          changed = true;
        }
      }
      if (changed) {
        const activeUsers = Array.from(usersInRoom.values());
        io.to(roomId).emit('users-updated', { users: activeUsers });
      }
    });
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// --- Yjs / WebSocket Setup ---
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', setupWSConnection);

server.on('upgrade', (request, socket, head) => {
  // Pass socket.io traffic
  if (request.url.startsWith('/socket.io')) {
    return;
  }
  // Let y-websocket handle everything else
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
