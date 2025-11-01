package com.music.demo.util;

import com.music.demo.entity.Song;
import com.music.demo.entity.User;
import com.music.demo.repository.SongRepository;
import com.music.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    @Autowired private UserRepository userRepo;
    @Autowired private SongRepository songRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByUsername("admin").isEmpty()) {
            userRepo.save(new User("admin", passwordEncoder.encode("adminpass"), "ADMIN"));
            userRepo.save(new User("user1", passwordEncoder.encode("userpass"), "USER"));
        }
        if (songRepo.count() == 0) {
            songRepo.save(new Song("Let It Be", "The Beatles", "Rock", 243));
            songRepo.save(new Song("Shape of You", "Ed Sheeran", "Pop", 233));
            songRepo.save(new Song("Believer", "Imagine Dragons", "Rock", 204));
        }
    }
}
