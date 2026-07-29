package com.codeduo.friend.service;

import com.codeduo.friend.dto.FriendDtos.*;
import com.codeduo.friend.entity.Friendship;
import com.codeduo.friend.entity.StudyGroup;
import com.codeduo.friend.entity.StudyGroupJoinRequest;
import com.codeduo.friend.entity.StudyGroupMember;
import com.codeduo.friend.repository.FriendshipRepository;
import com.codeduo.friend.repository.StudyGroupJoinRequestRepository;
import com.codeduo.friend.repository.StudyGroupMemberRepository;
import com.codeduo.friend.repository.StudyGroupRepository;
import com.codeduo.friend.type.FriendshipStatus;
import com.codeduo.global.exception.BusinessException;
import com.codeduo.problem.type.Language;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendService {
    private static final int ONLINE_THRESHOLD_MINUTES = 2;

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final StudyGroupJoinRequestRepository studyGroupJoinRequestRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional(readOnly = true)
    public FriendsResponse getFriends(User currentUser) {
        Long currentUserId = currentUser.getId();
        Set<Long> friendIds = friendIdsOf(currentUserId);
        Set<Long> joinedGroupIds = studyGroupMemberRepository.findAllByUserId(currentUserId).stream()
                .map(member -> member.getStudyGroup().getId())
                .collect(Collectors.toSet());
        Set<Long> pendingGroupIds = studyGroupJoinRequestRepository.findAllByUserId(currentUserId).stream()
                .map(request -> request.getStudyGroup().getId())
                .collect(Collectors.toSet());

        return new FriendsResponse(
                userRepository.findAll().stream()
                        .filter(user -> !user.getId().equals(currentUserId))
                        .map(user -> new Friend(
                                String.valueOf(user.getId()),
                                user.getNickname(),
                                avatarOf(user),
                                user.getXp(),
                                levelOf(user.getXp()),
                                friendIds.contains(user.getId()),
                                friendIds.contains(user.getId()) ? "friends" : "none"
                        ))
                        .toList(),
                studyGroupRepository.findAll().stream()
                        .map(group -> toStudyGroup(group, currentUserId, joinedGroupIds, pendingGroupIds))
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public List<Friend> searchUsers(User currentUser, String query) {
        String safeQuery = query == null ? "" : query.trim();
        if (safeQuery.length() < 2) return List.of();
        return userRepository.findTop20ByNicknameContainingIgnoreCaseAndIdNotOrderByNicknameAsc(safeQuery, currentUser.getId()).stream()
                .map(user -> new Friend(
                        String.valueOf(user.getId()),
                        user.getNickname(),
                        avatarOf(user),
                        user.getXp(),
                        levelOf(user.getXp()),
                        "friends".equals(relationStatus(currentUser.getId(), user.getId())),
                        relationStatus(currentUser.getId(), user.getId())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<com.codeduo.friend.dto.FriendDtos.StudyGroup> searchGroups(User currentUser, String query) {
        String safeQuery = query == null ? "" : query.trim();
        if (safeQuery.length() < 2) return List.of();
        Set<Long> joinedGroupIds = studyGroupMemberRepository.findAllByUserId(currentUser.getId()).stream()
                .map(member -> member.getStudyGroup().getId())
                .collect(Collectors.toSet());
        Set<Long> pendingGroupIds = studyGroupJoinRequestRepository.findAllByUserId(currentUser.getId()).stream()
                .map(request -> request.getStudyGroup().getId())
                .collect(Collectors.toSet());
        return studyGroupRepository.findTop20ByNameContainingIgnoreCaseOrderByNameAsc(safeQuery).stream()
                .map(group -> toStudyGroup(group, currentUser.getId(), joinedGroupIds, pendingGroupIds))
                .toList();
    }

    public FriendsResponse createGroup(User currentUser, CreateGroupRequest request) {
        String name = clean(request.name());
        if (name.length() < 2) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "그룹 이름은 2자 이상이어야 합니다.");
        }
        if (studyGroupRepository.existsByName(name)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "이미 같은 이름의 그룹이 있습니다.");
        }
        int maxMembers = Math.max(2, Math.min(50, request.maxMembers()));
        Language language = parseLanguage(request.language());
        StudyGroup group = studyGroupRepository.save(StudyGroup.builder()
                .name(name)
                .description(limit(clean(request.description()), 1000))
                .maxMembers(maxMembers)
                .imageUrl(limit(clean(request.imageUrl()), 2_000_000))
                .language(language)
                .owner(currentUser)
                .build());
        studyGroupMemberRepository.save(StudyGroupMember.builder()
                .studyGroup(group)
                .user(currentUser)
                .build());
        return getFriends(currentUser);
    }

    public FriendsResponse addFriend(User currentUser, Long targetUserId) {
        if (currentUser.getId().equals(targetUserId)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "자기 자신은 친구로 추가할 수 없습니다.");
        }
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        friendshipRepository.findBetweenUsers(currentUser.getId(), targetUserId).ifPresentOrElse(friendship -> {
            if (isAccepted(friendship)) return;
            if (friendship.getAddressee().getId().equals(currentUser.getId())) {
                friendship.setStatus(FriendshipStatus.ACCEPTED);
            }
        }, () -> friendshipRepository.save(Friendship.builder()
                        .requester(currentUser)
                        .addressee(target)
                        .status(FriendshipStatus.PENDING)
                        .build()));
        return getFriends(currentUser);
    }

    public FriendsResponse removeFriend(User currentUser, Long targetUserId) {
        friendshipRepository.findBetweenUsers(currentUser.getId(), targetUserId)
                .ifPresent(friendshipRepository::delete);
        return getFriends(currentUser);
    }

    @Transactional(readOnly = true)
    public FriendRequestsResponse getRequests(User currentUser) {
        List<FriendRequest> received = friendshipRepository
                .findAllByAddresseeIdAndStatus(currentUser.getId(), FriendshipStatus.PENDING)
                .stream()
                .map(friendship -> new FriendRequest(String.valueOf(friendship.getId()), toFriend(friendship.getRequester(), "received"), "received"))
                .toList();
        List<FriendRequest> sent = friendshipRepository
                .findAllByRequesterIdAndStatus(currentUser.getId(), FriendshipStatus.PENDING)
                .stream()
                .map(friendship -> new FriendRequest(String.valueOf(friendship.getId()), toFriend(friendship.getAddressee(), "sent"), "sent"))
                .toList();
        return new FriendRequestsResponse(received, sent);
    }

    public FriendsResponse acceptRequest(User currentUser, Long userId) {
        Friendship friendship = friendshipRepository.findBetweenUsers(currentUser.getId(), userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "친구 요청을 찾을 수 없습니다."));
        if (!friendship.getAddressee().getId().equals(currentUser.getId()) || !isPending(friendship)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "수락할 수 없는 친구 요청입니다.");
        }
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return getFriends(currentUser);
    }

    public FriendsResponse rejectRequest(User currentUser, Long userId) {
        Friendship friendship = friendshipRepository.findBetweenUsers(currentUser.getId(), userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "친구 요청을 찾을 수 없습니다."));
        if (!isPending(friendship)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "거절할 수 없는 친구 요청입니다.");
        }
        friendshipRepository.delete(friendship);
        return getFriends(currentUser);
    }

    public FriendsResponse joinGroup(User currentUser, Long groupId) {
        var group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));
        if (studyGroupMemberRepository.findByStudyGroupIdAndUserId(groupId, currentUser.getId()).isPresent()) {
            return getFriends(currentUser);
        }
        if (studyGroupJoinRequestRepository.existsByStudyGroupIdAndUserId(groupId, currentUser.getId())) {
            return getFriends(currentUser);
        }
        if (studyGroupMemberRepository.countByStudyGroupId(groupId) >= maxMembersOf(group)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "그룹 정원이 가득 찼습니다.");
        }
        studyGroupJoinRequestRepository.save(StudyGroupJoinRequest.builder()
                .studyGroup(group)
                .user(currentUser)
                .build());
        return getFriends(currentUser);
    }

    public FriendsResponse leaveGroup(User currentUser, Long groupId) {
        studyGroupMemberRepository.findByStudyGroupIdAndUserId(groupId, currentUser.getId())
                .ifPresent(studyGroupMemberRepository::delete);
        studyGroupJoinRequestRepository.deleteByStudyGroupIdAndUserId(groupId, currentUser.getId());
        return getFriends(currentUser);
    }

    public GroupDetailResponse acceptGroupRequest(User currentUser, Long groupId, Long userId) {
        StudyGroup group = requireOwnedGroup(currentUser, groupId);
        StudyGroupJoinRequest request = studyGroupJoinRequestRepository.findByStudyGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "그룹 참가 신청을 찾을 수 없습니다."));
        if (studyGroupMemberRepository.countByStudyGroupId(groupId) >= maxMembersOf(group)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "그룹 정원이 가득 찼습니다.");
        }
        studyGroupMemberRepository.findByStudyGroupIdAndUserId(groupId, userId)
                .orElseGet(() -> studyGroupMemberRepository.save(StudyGroupMember.builder()
                        .studyGroup(group)
                        .user(request.getUser())
                        .build()));
        studyGroupJoinRequestRepository.delete(request);
        return getGroupDetail(currentUser, groupId);
    }

    public GroupDetailResponse rejectGroupRequest(User currentUser, Long groupId, Long userId) {
        requireOwnedGroup(currentUser, groupId);
        studyGroupJoinRequestRepository.deleteByStudyGroupIdAndUserId(groupId, userId);
        return getGroupDetail(currentUser, groupId);
    }

    @Transactional(readOnly = true)
    public GroupDetailResponse getGroupDetail(User currentUser, Long groupId) {
        var group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));
        List<StudyGroupMember> memberships = studyGroupMemberRepository.findAllByStudyGroupId(groupId);
        List<Long> userIds = memberships.stream()
                .map(member -> member.getUser().getId())
                .toList();
        Map<Long, Integer> weeklySolvedByUser = userIds.isEmpty()
                ? Map.of()
                : submissionRepository.countWeeklyCorrectByUsersAndLanguage(userIds, group.getLanguage(), weekStart(), weekEnd()).stream()
                        .collect(Collectors.toMap(
                                row -> (Long) row[0],
                                row -> ((Long) row[1]).intValue()
                        ));
        List<GroupMember> members = memberships.stream()
                .map(member -> toGroupMember(member.getUser(), group.getLanguage(), weeklySolvedByUser.getOrDefault(member.getUser().getId(), 0)))
                .sorted((left, right) -> Integer.compare(right.weeklySolved(), left.weeklySolved()))
                .toList();
        int weeklySolved = members.stream().mapToInt(GroupMember::weeklySolved).sum();
        int averageStreak = members.isEmpty() ? 0 : (int) Math.round(members.stream().mapToInt(GroupMember::streak).average().orElse(0));
        int onlineCount = (int) members.stream().filter(GroupMember::online).count();
        boolean ownedByMe = isOwner(group, currentUser.getId());
        boolean joined = studyGroupMemberRepository.findByStudyGroupIdAndUserId(groupId, currentUser.getId()).isPresent();
        boolean pendingRequest = studyGroupJoinRequestRepository.existsByStudyGroupIdAndUserId(groupId, currentUser.getId());
        List<GroupJoinRequest> pendingRequests = ownedByMe
                ? studyGroupJoinRequestRepository.findAllByStudyGroupId(groupId).stream()
                        .map(request -> new GroupJoinRequest(
                                String.valueOf(request.getId()),
                                toFriend(request.getUser(), "none"),
                                request.getRequestedAt() == null ? "" : request.getRequestedAt().toString()
                        ))
                        .toList()
                : List.of();
        return new GroupDetailResponse(
                String.valueOf(group.getId()),
                group.getName(),
                safe(group.getDescription()),
                group.getLanguage().name().toLowerCase(),
                safe(group.getImageUrl()),
                group.getOwner() == null ? "" : String.valueOf(group.getOwner().getId()),
                group.getOwner() == null ? "" : group.getOwner().getNickname(),
                memberships.size(),
                maxMembersOf(group),
                Math.max(10, memberships.size() * 10),
                weeklySolved,
                averageStreak,
                onlineCount,
                joined,
                pendingRequest,
                ownedByMe,
                members,
                pendingRequests
        );
    }

    private com.codeduo.friend.dto.FriendDtos.StudyGroup toStudyGroup(StudyGroup group, Long currentUserId, Set<Long> joinedGroupIds, Set<Long> pendingGroupIds) {
        return new com.codeduo.friend.dto.FriendDtos.StudyGroup(
                String.valueOf(group.getId()),
                group.getName(),
                safe(group.getDescription()),
                (int) studyGroupMemberRepository.countByStudyGroupId(group.getId()),
                maxMembersOf(group),
                group.getLanguage().name().toLowerCase(),
                safe(group.getImageUrl()),
                group.getOwner() == null ? "" : String.valueOf(group.getOwner().getId()),
                group.getOwner() == null ? "" : group.getOwner().getNickname(),
                joinedGroupIds.contains(group.getId()),
                pendingGroupIds.contains(group.getId()),
                isOwner(group, currentUserId)
        );
    }

    private Long otherUserId(Friendship friendship, Long currentUserId) {
        Long requesterId = friendship.getRequester().getId();
        return requesterId.equals(currentUserId) ? friendship.getAddressee().getId() : requesterId;
    }

    private Set<Long> friendIdsOf(Long userId) {
        return friendshipRepository.findAllByUserId(userId).stream()
                .filter(this::isAccepted)
                .map(friendship -> otherUserId(friendship, userId))
                .collect(Collectors.toSet());
    }

    private String relationStatus(Long currentUserId, Long targetUserId) {
        return friendshipRepository.findBetweenUsers(currentUserId, targetUserId)
                .map(friendship -> {
                    if (isAccepted(friendship)) return "friends";
                    return friendship.getRequester().getId().equals(currentUserId) ? "sent" : "received";
                })
                .orElse("none");
    }

    private Friend toFriend(User user, String relationStatus) {
        return new Friend(
                String.valueOf(user.getId()),
                user.getNickname(),
                avatarOf(user),
                user.getXp(),
                levelOf(user.getXp()),
                "friends".equals(relationStatus),
                relationStatus
        );
    }

    private boolean isAccepted(Friendship friendship) {
        return friendship.getStatus() == null || friendship.getStatus() == FriendshipStatus.ACCEPTED;
    }

    private boolean isPending(Friendship friendship) {
        return friendship.getStatus() == FriendshipStatus.PENDING;
    }

    private String avatarOf(User user) {
        if (user.getAvatar() != null && !user.getAvatar().isBlank()) return user.getAvatar();
        String nickname = user.getNickname();
        return nickname.length() >= 2 ? nickname.substring(0, 2).toUpperCase() : nickname.toUpperCase();
    }

    private int levelOf(int xp) {
        return Math.max(1, xp / 200 + 1);
    }

    private StudyGroup requireOwnedGroup(User currentUser, Long groupId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));
        if (!isOwner(group, currentUser.getId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "그룹장만 처리할 수 있습니다.");
        }
        return group;
    }

    private boolean isOwner(StudyGroup group, Long userId) {
        return group.getOwner() != null && group.getOwner().getId().equals(userId);
    }

    private int maxMembersOf(StudyGroup group) {
        return group.getMaxMembers() > 0 ? group.getMaxMembers() : 20;
    }

    private Language parseLanguage(String value) {
        try {
            return Language.valueOf(clean(value).toUpperCase());
        } catch (Exception e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "지원하지 않는 언어입니다.");
        }
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String limit(String value, int maxLength) {
        if (value == null) return "";
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private GroupMember toGroupMember(User user, Language language, int weeklySolved) {
        return new GroupMember(
                String.valueOf(user.getId()),
                user.getNickname(),
                avatarOf(user),
                user.getXp(),
                user.getStreakCount(),
                weeklySolved,
                progressOf(user.getXp(), language),
                isOnline(user)
        );
    }

    private boolean isOnline(User user) {
        return user.getLastSeenAt() != null
                && user.getLastSeenAt().isAfter(LocalDateTime.now().minusMinutes(ONLINE_THRESHOLD_MINUTES));
    }

    private int progressOf(int xp, Language language) {
        int maxXp = switch (language) {
            case PYTHON -> 300;
            case JAVA -> 200;
            case C -> 250;
            case CPP -> 150;
        };
        return Math.min(100, Math.round((xp / (float) maxXp) * 100));
    }

    private LocalDateTime weekStart() {
        return LocalDate.now()
                .with(DayOfWeek.MONDAY)
                .atStartOfDay();
    }

    private LocalDateTime weekEnd() {
        return weekStart().plusWeeks(1).minusNanos(1);
    }
}
