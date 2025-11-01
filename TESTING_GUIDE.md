# Music App Testing Guide

## Start the Application
```bash
mvn spring-boot:run
```
Wait for: `Started DemoApplication`

## Testing in Postman

### Base URL
`http://localhost:8080`

---

## 1. User Management

### Register User
- **Method:** POST
- **URL:** `/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "user1",
  "password": "password"
}
```

### Register Admin (for adding songs)
- **Method:** POST
- **URL:** `/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "admin",
  "password": "adminpass",
  "role": "ADMIN"
}
```

### Login (Get JWT Token)
- **Method:** POST
- **URL:** `/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "user1",
  "password": "password"
}
```
- **Response:** `{"token": "eyJhbGci..."}`
- **Save the token!**

### View Profile
- **Method:** GET
- **URL:** `/users/me`
- **Headers:** `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 2. Song Management

### List All Songs (Public - No Auth Required)
- **Method:** GET
- **URL:** `/songs/public`

### Search Songs
- **Method:** GET
- **URL:** `/songs/search?title=love` OR `/songs/search?artist=artist1` OR `/songs/search?genre=pop`

### Add Song (Admin Only)
- **Method:** POST
- **URL:** `/songs`
- **Headers:** 
  - `Authorization: Bearer ADMIN_TOKEN`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "genre": "Pop",
  "durationSeconds": 240
}
```

### Get Song by ID
- **Method:** GET
- **URL:** `/songs/1`

---

## 3. Playlist Management

### Create Playlist
- **Method:** POST
- **URL:** `/playlists`
- **Headers:** 
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "My Favorite Songs"
}
```

### Add Song to Playlist
- **Method:** POST
- **URL:** `/playlists/1/add/1`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- (Replace 1 with playlist ID and song ID)

### Remove Song from Playlist
- **Method:** POST
- **URL:** `/playlists/1/remove/1`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`

### View My Playlists
- **Method:** GET
- **URL:** `/playlists/mine`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`

---

## 4. Playback Simulation

### Play Song
- **Method:** POST
- **URL:** `/playback/play/1`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- (Replace 1 with song ID)

### Pause Song
- **Method:** POST
- **URL:** `/playback/pause`
- **Headers:** 
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- **Body (optional position):**
```json
{
  "pos": 45
}
```

### Resume Song
- **Method:** POST
- **URL:** `/playback/resume`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`

### Stop Song
- **Method:** POST
- **URL:** `/playback/stop`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`

### Get Current Playing Song
- **Method:** GET
- **URL:** `/playback/current`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`

---

## Quick Test Flow

1. Register user: `POST /auth/register` with user credentials
2. Register admin: `POST /auth/register` with admin credentials + `"role": "ADMIN"`
3. Login as admin: `POST /auth/login` → Save admin token
4. Add songs: `POST /songs` (use admin token)
5. Login as user: `POST /auth/login` → Save user token
6. View songs: `GET /songs/public` (no token needed)
7. Create playlist: `POST /playlists` (use user token)
8. Add song to playlist: `POST /playlists/1/add/1` (use user token)
9. Play song: `POST /playback/play/1` (use user token)
10. Check current: `GET /playback/current` (use user token)

---

## H2 Database Console (Optional)
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:musicdb`
- Username: `sa`
- Password: (empty)

