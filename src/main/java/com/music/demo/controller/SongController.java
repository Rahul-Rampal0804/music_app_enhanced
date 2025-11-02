package com.music.demo.controller;

import com.music.demo.entity.Song;
import com.music.demo.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/songs")
public class SongController {
    @Autowired private SongRepository songRepo;
    
    // Pattern to extract YouTube video ID from various URL formats
    private static final Pattern YOUTUBE_ID_PATTERN = Pattern.compile(
        "(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^\"&?\\s]{11})"
    );

    @GetMapping("/public")
    public List<Song> listAll(){ return songRepo.findAll(); }

    @GetMapping("/search")
    public List<Song> search(@RequestParam(required = false) String title,
                             @RequestParam(required = false) String artist,
                             @RequestParam(required = false) String genre){
        if (title != null) return songRepo.findByTitleContainingIgnoreCase(title);
        if (artist != null) return songRepo.findByArtistContainingIgnoreCase(artist);
        if (genre != null) return songRepo.findByGenreContainingIgnoreCase(genre);
        return songRepo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Song addSong(@RequestBody Song song){ return songRepo.save(song); }

    @GetMapping("/{id}")
    public ResponseEntity<Song> get(@PathVariable Long id){
        return songRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/youtube/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSongWithYouTubeLink(@RequestBody Map<String, String> body) {
        try {
            String youtubeLink = body.get("youtubeLink");
            String title = body.get("title");
            String artist = body.get("artist");
            String genre = body.getOrDefault("genre", "Unknown");
            String durationStr = body.getOrDefault("durationSeconds", "0");
            Integer durationSeconds = 0;
            
            // Extract YouTube video ID from link
            String videoId = extractYouTubeVideoId(youtubeLink);
            if (videoId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid YouTube URL. Please provide a valid YouTube link."));
            }
            
            // Generate thumbnail URL
            String thumbnailUrl = "https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
            
            // Parse duration if provided
            try {
                durationSeconds = Integer.parseInt(durationStr);
            } catch (NumberFormatException e) {
                // Default to 0 if invalid
            }

            Song song = new Song();
            song.setTitle(title != null ? title : "Unknown Title");
            song.setArtist(artist != null ? artist : "Unknown Artist");
            song.setGenre(genre);
            song.setDurationSeconds(durationSeconds);
            song.setYoutubeVideoId(videoId);
            song.setThumbnailUrl(thumbnailUrl);

            song = songRepo.save(song);
            return ResponseEntity.ok(song);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    private String extractYouTubeVideoId(String youtubeLink) {
        if (youtubeLink == null || youtubeLink.trim().isEmpty()) {
            return null;
        }
        
        // If it's already just a video ID (11 characters), return it
        if (youtubeLink.trim().length() == 11 && youtubeLink.matches("[a-zA-Z0-9_-]{11}")) {
            return youtubeLink.trim();
        }
        
        // Try to extract from URL
        Matcher matcher = YOUTUBE_ID_PATTERN.matcher(youtubeLink);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        return null;
    }
}
