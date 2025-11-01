package com.music.demo.controller;

import com.music.demo.entity.Playback;
import com.music.demo.entity.Song;
import com.music.demo.entity.User;
import com.music.demo.repository.PlaybackRepository;
import com.music.demo.repository.SongRepository;
import com.music.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import java.util.Map;

@RestController
@RequestMapping("/playback")
public class PlaybackController {
    @Autowired private PlaybackRepository playbackRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private SongRepository songRepo;

    @PostMapping("/play/{songId}")
    public ResponseEntity<?> play(@PathVariable Long songId, Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        Song s = songRepo.findById(songId).orElseThrow();
        Playback p = playbackRepo.findByUser(u).orElse(new Playback(u, s, "PLAYING"));
        p.setSong(s); p.setStatus("PLAYING"); p.setPositionSeconds(0);
        playbackRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/pause")
    public ResponseEntity<?> pause(@RequestBody Map<String,Integer> body, Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        Playback p = playbackRepo.findByUser(u).orElseThrow();
        p.setStatus("PAUSED");
        if (body.containsKey("pos")) p.setPositionSeconds(body.get("pos"));
        playbackRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/resume")
    public ResponseEntity<?> resume(Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        Playback p = playbackRepo.findByUser(u).orElseThrow();
        p.setStatus("PLAYING");
        playbackRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stop(Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        Playback p = playbackRepo.findByUser(u).orElseThrow();
        p.setStatus("STOPPED"); p.setPositionSeconds(0);
        playbackRepo.save(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/current")
    public ResponseEntity<?> current(Authentication auth){
        User u = userRepo.findByUsername(auth.getName()).orElseThrow();
        return playbackRepo.findByUser(u)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

    }
}
