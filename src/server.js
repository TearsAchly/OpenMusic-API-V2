// Load environment variables from .env file
require('dotenv').config();

// Import Hapi framework
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt'); 

// Import plugins for endpoints
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');

// Import PostgreSQL services 
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const CollaborationsService = require('./services/postgres/CollaborationsService');



// Import validators 
const { AlbumsValidator, SongsValidator, UsersValidator, AuthenticationsValidator, PlaylistsValidator, CollaborationsValidator } = require('./validator');
const ClientError = require('./exceptions/ClientError'); // Import ClientError class
const TokenManager = require('./token/TokenManager.js');

// Function to initialize the Hapi server
const init = async () => {

  // Create instances of Service 
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();

  

  // Create a new Hapi server instance
  const server = Hapi.server({
    port: process.env.PORT || 5000, // Set server port from environment variable or default to 5000
    host: process.env.HOST || 'localhost', // Set server host from environment variable or default to 'localhost'
    routes: {
      cors: {
        origin: ['*'], // Enable CORS for all origins
      },
    },
  });
  
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });


  // Register plugins 
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService, 
        validator: AlbumsValidator, 
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService, 
        validator: SongsValidator, 
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service:  playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  // Intercept response to handle errors before sending to client
  server.ext('onPreResponse', (request, h) => {
    // Get the response context from the request
    const { response } = request;

    if (response instanceof Error) {
      // Handle client error internally
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Handle specific Hapi client errors (e.g., 401)
      if (!response.isServer) {
        // Example of handling 401 error specifically
        if (response.output.statusCode === 401) {
          const newResponse = h.response({
            status: 'fail',
            message: 'your request was rejected because the authentication token you provided is invalid, has expired,',
          });
          newResponse.code(401);
          return newResponse;
        }
        return h.continue;
      }

      // Handle server error as needed
      const newResponse = h.response({
        status: 'error',
        message: 'There was a failure on our servers',
      });
      newResponse.code(500);
      return newResponse;
    }

    // If not an error, proceed with the previous response (without intervention)
    return h.continue;
  });

  // Start the server
  await server.start();
  console.log(`Server running at: ${server.info.uri}`); // Log server URI on successful start
};

// Call the init function to start the server
init();
