package com.music.demo.repository;

import com.music.demo.entity.Playback;
import com.music.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PlaybackRepository extends JpaRepository<Playback, Long> {
    Optional<Playback> findByUser(User user);
}
