package com.codeduo.friend.repository;

import com.codeduo.friend.entity.Friendship;
import com.codeduo.friend.type.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    @Query("""
            select f from Friendship f
            where f.requester.id = :userId or f.addressee.id = :userId
            """)
    List<Friendship> findAllByUserId(@Param("userId") Long userId);

    @Query("""
            select f from Friendship f
            where (f.requester.id = :firstUserId and f.addressee.id = :secondUserId)
               or (f.requester.id = :secondUserId and f.addressee.id = :firstUserId)
            """)
    Optional<Friendship> findBetweenUsers(
            @Param("firstUserId") Long firstUserId,
            @Param("secondUserId") Long secondUserId
    );

    List<Friendship> findAllByAddresseeIdAndStatus(Long addresseeId, FriendshipStatus status);
    List<Friendship> findAllByRequesterIdAndStatus(Long requesterId, FriendshipStatus status);
}
