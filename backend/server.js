import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './src/typeDefs/index.js';
import { resolvers } from './src/resolvers/index.js';
import { connectDatabase } from './src/utils/database.js';
import { seedDatabase } from './src/utils/seedData.js';
import { getUser } from './src/middleware/auth.js';

// Load environment variables
dotenv.config();

async function startServer() {
  // Connect to database
  await connectDatabase();
  
  // Seed database with initial data
  await seedDatabase();

  // Create Express app
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }));

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Get user from token for authentication
      const user = await getUser(req);
      return { user };
    },
    // Enable GraphQL Playground in development
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo GraphQL middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We handle CORS above
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Start server
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available in development mode`);
    console.log(`💾 Database: ${process.env.MONGODB_URI}`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
