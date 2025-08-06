import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { setupSocket } from './socket/socket';

dotenv.config();

const server = http.createServer(app);
setupSocket(server); // Attach socket.io

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));