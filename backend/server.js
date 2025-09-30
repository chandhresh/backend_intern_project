require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const seedDemo = require('./src/utils/seedDemo');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect MongoDB
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intern_project';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedDemo(); // seed admin + products
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Intern Project API',
      version: '1.0.0',
      description: 'Authentication and Products API with JWT',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }] // Apply JWT globally to protected endpoints
  },
  apis: ['./src/routes/*.js'], // your annotated route files
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Intern Project Backend' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
