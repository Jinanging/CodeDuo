package com.codeduo.friend.dto;

import java.util.List;

public class FriendDtos {
    public record Friend(String id, String username, String avatar, int xp, int level, boolean friend, String relationStatus) {}
    public record FriendRequest(String id, Friend user, String direction) {}
    public record FriendRequestsResponse(List<FriendRequest> received, List<FriendRequest> sent) {}
    public record StudyGroup(String id, String name, int memberCount, String language, boolean joined) {}
    public record FriendsResponse(List<Friend> users, List<StudyGroup> groups) {}
    public record GroupMember(String id, String username, String avatar, int xp, int streak, int weeklySolved, int progress, boolean online) {}
    public record GroupDetailResponse(
            String id,
            String name,
            String language,
            int memberCount,
            int weeklyGoal,
            int weeklySolved,
            int averageStreak,
            int onlineCount,
            List<GroupMember> members
    ) {}
}
