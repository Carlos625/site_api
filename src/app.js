import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API de Blog - Sistema RESTful',
    endpoints: {
      users: '/users',
      categories: '/categories',
      posts: '/posts',
    },
  });
});

app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', postRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export default app;