package com.codeduo.friend.service;

import com.codeduo.friend.dto.FriendDtos.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService {
    public FriendsResponse getFriends() {
        return new FriendsResponse(
                List.of(
                        new Friend("u1", "algo_master", "AM", 4200, 21, true),
                        new Friend("u2", "java_wizard", "JW", 3100, 16, true),
                        new Friend("u3", "c_pointer", "CP", 1800, 9, false),
                        new Friend("u4", "py_snake", "PS", 2900, 14, false)
                ),
                List.of(
                        new StudyGroup("g1", "Python 스터디", 12, "python", true),
                        new StudyGroup("g2", "알고리즘 크루", 8, "cpp", false),
                        new StudyGroup("g3", "Java 백엔드 팀", 5, "java", false),
                        new StudyGroup("g4", "C 시스템 마스터", 7, "c", true)
                )
        );
    }
}
