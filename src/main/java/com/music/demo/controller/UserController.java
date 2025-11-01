package com.music.demo.controller;

import com.music.demo.entity.User;
import com.music.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired private UserRepository userRepo;

    @GetMapping("/me")
    public User me(Authentication auth){
        return userRepo.findByUsername(auth.getName()).orElseThrow();
    }
}
