import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';
import path from 'path';
import userRoute from './routes/userRoute.js';
dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(cors(
    {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  ));
}
app.use(express.json());
app.use('/api/users', userRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend", 'dist')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", 'dist', 'index.html'));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
