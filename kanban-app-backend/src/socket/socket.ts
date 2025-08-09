import { Server } from 'http';
import { Server as IOServer } from 'socket.io';

let io: IOServer;

export const setupSocket = (server: Server) => {
  io = new IOServer(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinWorkspace', (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on('joinBoard', (boardId) => {
      socket.join(`board:${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export const getIO = () => io;