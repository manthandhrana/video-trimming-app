// app.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import videoRoutes from './routes/videoRoutes.js';
import swaggerSpec from './swagger/swagger.js'; // Ensure the path is correct

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded videos

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Video Trimming App");
});

// Routes
app.use('/', videoRoutes);

// Export the app as a named export
export { app };

