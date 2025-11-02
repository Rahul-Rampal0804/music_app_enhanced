# Music App Frontend

React frontend for the Music Streaming application.

## Features

- 🔐 User authentication (Login/Register)
- 🎵 Browse and search songs
- 📀 Create and manage playlists
- ▶️ Play songs (playback control)
- 🎨 Modern, responsive UI

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8082`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Login component
│   │   ├── Register.js       # Registration component
│   │   ├── SongList.js       # Song browsing and search
│   │   ├── PlaylistManager.js # Playlist management
│   │   ├── Navbar.js         # Navigation bar
│   │   └── ProtectedRoute.js # Route protection
│   ├── services/
│   │   ├── api.js           # API service layer
│   │   └── auth.js          # Auth utilities
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8082`. 
You can change this in `src/services/api.js` if needed.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Authentication Flow

1. Users can register a new account or login with existing credentials
2. JWT tokens are stored in localStorage
3. Tokens are automatically included in API requests
4. Protected routes require authentication

## Notes

- Make sure the backend server is running before starting the frontend
- The backend must have CORS configured (already set up in the project)
- JWT tokens are stored in browser localStorage

