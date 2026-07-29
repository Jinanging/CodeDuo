package com.codeduo.friend.dto;

import java.util.List;

public class FriendDtos {
    public record Friend(String id, String username, String avatar, int xp, int level, boolean friend, String relationStatus) {}
    public record FriendRequest(String id, Friend user, String direction) {}
    public record FriendRequestsResponse(List<FriendRequest> received, List<FriendRequest> sent) {}
    public record StudyGroup(
            String id,
            String name,
            String description,
            int memberCount,
            int maxMembers,
            String language,
            String imageUrl,
            String ownerId,
            String ownerName,
            boolean joined,
            boolean pendingRequest,
            boolean ownedByMe
    ) {}
    public record FriendsResponse(List<Friend> users, List<StudyGroup> groups) {}
    public record GroupMember(String id, String username, String avatar, int xp, int streak, int weeklySolved, int progress, boolean online) {}
    public record CreateGroupRequest(String name, String description, int maxMembers, String language, String imageUrl) {}
    public record GroupJoinRequest(String id, Friend user, String requestedAt) {}
    public record GroupDetailResponse(
            String id,
            String name,
            String description,
            String language,
            String imageUrl,
            String ownerId,
            String ownerName,
            int memberCount,
            int maxMembers,
            int weeklyGoal,
            int weeklySolved,
            int averageStreak,
            int onlineCount,
            boolean joined,
            boolean pendingRequest,
            boolean ownedByMe,
            List<GroupMember> members,
            List<GroupJoinRequest> pendingRequests
    ) {}
}
