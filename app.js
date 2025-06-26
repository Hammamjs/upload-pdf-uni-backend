import { config } from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connect from './config/db.js';
import { globalError } from './middleware/globalError.js';

import mongoSanitize from 'express-mongo-sanitize';
import mountRoutes from './routes/mountRoutes.js';
import corsOptions from './config/corsOptions.js';
import crendentials from './config/credentials.js';
import lastseen from './middleware/lastseenMiddleware.js';

// env
config();

// Connect to dataBase
connect();

const app = express();
const httpSvr = createServer(app);

const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const io = new Server(httpSvr, {
  cors: {
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://pdf-project-uni.vercel.app',
    // https://upload-pdf-uni-frontend-13ngme8sc-hammam-husseins-projects.vercel.app/
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(mongoSanitize());

app.use(express.json());
// parse cookie
app.use(cookieParser());

app.use(crendentials);

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: false }));

app.use(lastseen);
// Routes
mountRoutes(app);

app.use(globalError);

io.on('connection', (socket) => {
  console.log('user connected ', socket.id);

  socket.on('joinRoom', (studentId) => {
    socket.join(`student-${studentId}`);
    console.log('New Student joined ', studentId);
  });

  io.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

let server;

mongoose.connection.once('open', () => {
  console.log('Connected to database');
  server = httpSvr.listen(PORT, () => {
    // app.listen(PORT, () => {
    console.log(`server start running on port ${PORT}`);
    // });
  });
});

process.on('unhandledRejection', () => {
  console.log('unhandledRejection occur.');
  if (server) {
    server.close(() => {
      console.log('Server shutting down...');
    });
  }
  process.exit(1);
});
