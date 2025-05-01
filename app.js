import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import videoRoutes from './routes/videoRoutes.js'; // Ensure you use the `.js` extension for local files
import swaggerSpec from './swagger/swagger.js'; // Ensure you use the `.js` extension for local files


const app = express();

app.use(cors({
    origin: '*', // 👈 Allow all origins (not recommended for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/trimmed", express.static("trimmed"));

app.use("/", videoRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;  // Default export
