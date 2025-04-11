import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connect } from './config/database';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import routes from './routes/index';
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Connect to database and start server
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

export default app;
