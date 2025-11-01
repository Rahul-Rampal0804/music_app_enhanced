package com.music.demo.controller;

import com.music.demo.entity.Playlist;
import com.music.demo.entity.Song;
import com.music.demo.entity.User;
import com.music.demo.repository.PlaylistRepository;
import com.music.demo.repository.SongRepository;
import com.music.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/playlists")
public class PlaylistController {
    @Autowired private PlaylistRepository playlistRepo;
    @Autowired private SongRepository songRepo;
    @Autowired private UserRepository userRepo;

    @PostMapping
    public Playlist create(@RequestBody Map<String,String> body, Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        Playlist p = new Playlist(body.getOrDefault("name","My Playlist"), u);
        return playlistRepo.save(p);
    }

    @PostMapping("/{id}/add/{songId}")
    public ResponseEntity<?> addSong(@PathVariable Long id, @PathVariable Long songId, Authentication auth){
        Playlist p = playlistRepo.findById(id).orElseThrow();
        if (!p.getOwner().getUsername().equals(auth.getName())) return ResponseEntity.status(403).build();
        Song s = songRepo.findById(songId).orElseThrow();
        p.getSongs().add(s);
        playlistRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/{id}/remove/{songId}")
    public ResponseEntity<?> removeSong(@PathVariable Long id, @PathVariable Long songId, Authentication auth){
        Playlist p = playlistRepo.findById(id).orElseThrow();
        if (!p.getOwner().getUsername().equals(auth.getName())) return ResponseEntity.status(403).build();
        p.getSongs().removeIf(s -> s.getId().equals(songId));
        playlistRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/mine")
    public ResponseEntity<?> mine(Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(playlistRepo.findByOwner(u));
    }
}
