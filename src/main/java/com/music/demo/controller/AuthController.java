package com.music.demo.controller;

import com.music.demo.entity.User;
import com.music.demo.repository.UserRepository;
import com.music.demo.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    // Simple UserDetailsService bean via lambda
    @Autowired
    public void configureUserDetailsService(org.springframework.context.ApplicationContext ctx) {
        // nothing; UserDetailsService below implemented ad-hoc in login check
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String password = body.get("password");
        String role = body.getOrDefault("role","USER");
        if (username == null || password == null) return ResponseEntity.badRequest().body("username & password required");
        if (userRepo.findByUsername(username).isPresent()) return ResponseEntity.badRequest().body("username exists");
        User user = new User(username, passwordEncoder.encode(password), role);
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message","registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String password = body.get("password");
        Optional<User> maybe = userRepo.findByUsername(username);
        if (maybe.isEmpty()) return ResponseEntity.status(401).body("invalid credentials");
        User u = maybe.get();
        if (!passwordEncoder.matches(password, u.getPassword())) return ResponseEntity.status(401).body("invalid credentials");
        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
