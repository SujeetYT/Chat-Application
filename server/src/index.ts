import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import SocketService from './services/socket';
import express from 'express';

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = http.createServer(app);
const socketService = new SocketService();

socketService.io.attach(httpServer);

socketService.initListeners();
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
