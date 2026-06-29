package com.codeduo.friend.dto;

import java.util.List;

public class FriendDtos {
    public record Friend(String id, String username, String avatar, int xp, int level, boolean friend) {}
    public record StudyGroup(String id, String name, int memberCount, String language, boolean joined) {}
    public record FriendsResponse(List<Friend> users, List<StudyGroup> groups) {}
}
