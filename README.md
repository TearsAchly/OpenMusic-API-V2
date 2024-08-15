# OpenMusic API-V2

OpenMusic API is a RESTful API project for managing albums, songs, users, playlists, collaborations, and authentications using Hapi.js, PostgreSQL, and ESLint for code linting.

## Precondition

Before running this project, make sure you have installed:

- Node.js
- PostgreSQL

## Steps to Execute the Project

1. **Clone this repository**:

    ```sh
    git clone https://github.com/TearsAchly/OpenMusic-API-V2.git
    cd openmusic-api-v2
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Database configuration**:

    Make sure PostgreSQL is running and create a database named `AlbumsAndSongs`. Then adjust the `.env` file to your database settings:

    ```plaintext
    PGUSER=<YOUR_DB_USER>
    PGPASSWORD=<YOUR_DB_PASSWORD>
    PGDATABASE=AlbumsAndSongs
    PGHOST=localhost
    PGPORT=5432
    ACCESS_TOKEN_KEY=your_access_token_secret_key
    REFRESH_TOKEN_KEY=your_refresh_token_secret_key
    ACCESS_TOKEN_AGE=3600
    ```

4. **Run database migration**:

    ```sh
    npm run migrate up || npx run migrate up
    ```

5. **Run server**:

    ```sh
    npm start
    ```

6. **Linting code**:

    To ensure your code is free from linting issues, run:

    ```sh
    npx eslint .
    ```

## Directory Structure

- **eslint.config.mjs**: ESLint configuration.
- **migrations**: Directory for database migration scripts.
- **package.json**: Npm configuration file.
- **src/api**: Directory containing handlers, indexes, and routes for albums, songs, users, playlists, collaborations, and authentications.
- **src/exceptions**: Directory containing custom error classes.
- **src/server.js**: The main file for running the Hapi.js server.
- **src/services**: Directory containing services for interacting with the PostgreSQL database.
- **src/token**: Directory containing token management utility.
- **src/validator**: Directory containing validation schemes using Joi.

## Endpoints

- **Albums**
    - `POST /albums`: Adds a new album.
    - `GET /albums`: Gets a list of albums.
    - `GET /albums/{albumId}`: Gets album details.
    - `PUT /albums/{albumId}`: Updates the album.
    - `DELETE /albums/{albumId}`: Deletes an album.

- **Songs**
    - `POST /songs`: Adds new songs.
    - `GET /songs`: Gets a list of songs.
    - `GET /songs/{songId}`: Gets song details.
    - `PUT /songs/{songId}`: Updates songs.
    - `DELETE /songs/{songId}`: Deletes a song.

- **Users**
    - `POST /users`: Adds a new user.
    - `GET /users/{userId}`: Gets user details.

- **Playlists**
    - `POST /playlists`: Adds a new playlist.
    - `GET /playlists`: Gets a list of playlists.
    - `GET /playlists/{playlistId}`: Gets playlist details.
    - `PUT /playlists/{playlistId}`: Updates a playlist.
    - `DELETE /playlists/{playlistId}`: Deletes a playlist.

- **Collaborations**
    - `POST /collaborations`: Adds a new collaboration.
    - `DELETE /collaborations`: Deletes a collaboration.

- **Authentications**
    - `POST /authentications`: Logs in a user.
    - `PUT /authentications`: Refreshes authentication token.
    - `DELETE /authentications`: Logs out a user.

## Contribution

Please open a pull request or submit an issue to contribute to this project.

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more information.
