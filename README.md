# Music Streaming Application - Backend

A RESTful API for a simple music streaming application built with Spring Boot.

## Tech Stack
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **H2 Database** (In-memory)
- **Maven**

## Features Implemented

### 1. User Management
- ✅ User Registration (`POST /auth/register`)
- ✅ User Login (`POST /auth/login`) - Returns JWT token
- ✅ View Profile (`GET /users/me`)

### 2. Song Management
- ✅ List All Songs (`GET /songs/public`) - Public endpoint, no auth required
- ✅ Search Songs by Title (`GET /songs/search?title=...`)
- ✅ Search Songs by Artist (`GET /songs/search?artist=...`)
- ✅ Search Songs by Genre (`GET /songs/search?genre=...`)
- ✅ Add Song (`POST /songs`) - Admin only
- ✅ Get Song by ID (`GET /songs/{id}`)

### 3. Playlist Management
- ✅ Create Playlist (`POST /playlists`)
- ✅ Add Song to Playlist (`POST /playlists/{id}/add/{songId}`)
- ✅ Remove Song from Playlist (`POST /playlists/{id}/remove/{songId}`)
- ✅ View My Playlists (`GET /playlists/mine`)

### 4. Playback Simulation
- ✅ Play Song (`POST /playback/play/{songId}`)
- ✅ Pause Song (`POST /playback/pause`) - Optional position parameter
- ✅ Resume Song (`POST /playback/resume`)
- ✅ Stop Song (`POST /playback/stop`)
- ✅ Get Current Playing Song (`GET /playback/current`)

## How to Run

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Steps

1. **Navigate to project directory:**
   ```bash
   cd "demo 2"
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run from IDE: Right-click on `DemoApplication.java` → Run

4. **Application will start on:** `http://localhost:8082`

## API Endpoints

### Authentication Endpoints (No Auth Required)
- `POST /auth/register` - Register new user
  ```json
  {
    "username": "user1",
    "password": "password",
    "role": "USER"  // Optional, defaults to USER
  }
  ```

- `POST /auth/login` - Login and get JWT token
  ```json
  {
    "username": "user1",
    "password": "password"
  }
  ```
  Returns: `{"token": "eyJhbGciOiJIUzI1NiJ9..."}`

### Protected Endpoints (Require JWT Token)
Add header: `Authorization: Bearer YOUR_TOKEN_HERE`

#### User Endpoints
- `GET /users/me` - Get current user profile

#### Song Endpoints
- `GET /songs/public` - List all songs (No auth required)
- `GET /songs/search?title=...` - Search by title
- `GET /songs/search?artist=...` - Search by artist
- `GET /songs/search?genre=...` - Search by genre
- `POST /songs` - Add song (Admin only)
  ```json
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "genre": "Pop",
    "durationSeconds": 240
  }
  ```
- `GET /songs/{id}` - Get song by ID

#### Playlist Endpoints
- `POST /playlists` - Create playlist
  ```json
  {
    "name": "My Playlist"
  }
  ```
- `POST /playlists/{id}/add/{songId}` - Add song to playlist
- `POST /playlists/{id}/remove/{songId}` - Remove song from playlist
- `GET /playlists/mine` - Get all my playlists

#### Playback Endpoints
- `POST /playback/play/{songId}` - Play a song
- `POST /playback/pause` - Pause current song
  ```json
  {
    "pos": 60  // Optional: position in seconds
  }
  ```
- `POST /playback/resume` - Resume paused song
- `POST /playback/stop` - Stop current song
- `GET /playback/current` - Get current playback status

## Testing

Use Postman or any REST client to test the APIs. See `TESTING_GUIDE.md` for detailed testing steps.

### Quick Test Flow:
1. Register a user
2. Login to get JWT token
3. Register an admin (for adding songs)
4. Login as admin to get admin token
5. Add songs using admin token
6. Use user token for other operations

## Database

- **H2 In-Memory Database**
- Database URL: `jdbc:h2:mem:musicdb`
- H2 Console: `http://localhost:8082/h2-console`
  - Username: `sa`
  - Password: (empty)

## Project Structure

```
src/main/java/com/music/demo/
├── config/          # Security & JWT configuration
├── controller/      # REST controllers
├── entity/          # JPA entities
├── repository/      # Spring Data repositories
├── service/         # Business logic
└── DemoApplication.java
```

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (USER/ADMIN)
- Protected endpoints require `Authorization: Bearer <token>` header

## Notes

- The application uses an in-memory H2 database, so data is lost on restart
- Default songs are loaded automatically on startup (see `DataLoader.java`)
- JWT tokens expire after 10 hours

