package com.music.demo.controller;

import com.music.demo.entity.Song;
import com.music.demo.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
public class SongController {
    @Autowired private SongRepository songRepo;

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
}
