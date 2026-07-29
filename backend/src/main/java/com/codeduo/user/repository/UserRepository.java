package com.codeduo.user.repository;

import com.codeduo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNicknameIgnoreCase(String nickname);
    boolean existsByNicknameIgnoreCaseAndIdNot(String nickname, Long id);
    List<User> findTop20ByNicknameContainingIgnoreCaseAndIdNotOrderByNicknameAsc(String nickname, Long id);
}
