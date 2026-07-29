package com.codeduo.friend.controller;

import com.codeduo.friend.dto.FriendDtos.Friend;
import com.codeduo.friend.dto.FriendDtos.FriendRequestsResponse;
import com.codeduo.friend.dto.FriendDtos.FriendsResponse;
import com.codeduo.friend.dto.FriendDtos.CreateGroupRequest;
import com.codeduo.friend.dto.FriendDtos.GroupDetailResponse;
import com.codeduo.friend.dto.FriendDtos.StudyGroup;
import com.codeduo.friend.service.FriendService;
import com.codeduo.global.response.ApiResponse;
import com.codeduo.global.security.CurrentUser;
import com.codeduo.user.entity.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Friend")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendService friendService;

    @GetMapping
    public ApiResponse<FriendsResponse> friends(@CurrentUser User user) {
        return ApiResponse.ok("친구와 그룹을 조회했습니다.", friendService.getFriends(user));
    }

    @GetMapping("/search")
    public ApiResponse<List<Friend>> search(@CurrentUser User user, @RequestParam(defaultValue = "") String query) {
        return ApiResponse.ok("사용자를 검색했습니다.", friendService.searchUsers(user, query));
    }

    @GetMapping("/groups/search")
    public ApiResponse<List<StudyGroup>> searchGroups(@CurrentUser User user, @RequestParam(defaultValue = "") String query) {
        return ApiResponse.ok("그룹을 검색했습니다.", friendService.searchGroups(user, query));
    }

    @GetMapping("/requests")
    public ApiResponse<FriendRequestsResponse> requests(@CurrentUser User user) {
        return ApiResponse.ok("친구 요청을 조회했습니다.", friendService.getRequests(user));
    }

    @PostMapping("/{userId}")
    public ApiResponse<FriendsResponse> addFriend(@CurrentUser User user, @PathVariable Long userId) {
        return ApiResponse.ok("친구 요청을 보냈습니다.", friendService.addFriend(user, userId));
    }

    @PostMapping("/{userId}/accept")
    public ApiResponse<FriendsResponse> acceptFriend(@CurrentUser User user, @PathVariable Long userId) {
        return ApiResponse.ok("친구 요청을 수락했습니다.", friendService.acceptRequest(user, userId));
    }

    @DeleteMapping("/{userId}/request")
    public ApiResponse<FriendsResponse> rejectFriend(@CurrentUser User user, @PathVariable Long userId) {
        return ApiResponse.ok("친구 요청을 취소했습니다.", friendService.rejectRequest(user, userId));
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<FriendsResponse> removeFriend(@CurrentUser User user, @PathVariable Long userId) {
        return ApiResponse.ok("친구를 삭제했습니다.", friendService.removeFriend(user, userId));
    }

    @PostMapping("/groups/{groupId}/join")
    public ApiResponse<FriendsResponse> joinGroup(@CurrentUser User user, @PathVariable Long groupId) {
        return ApiResponse.ok("그룹 참가 신청을 보냈습니다.", friendService.joinGroup(user, groupId));
    }

    @PostMapping("/groups")
    public ApiResponse<FriendsResponse> createGroup(@CurrentUser User user, @RequestBody CreateGroupRequest request) {
        return ApiResponse.ok("그룹을 생성했습니다.", friendService.createGroup(user, request));
    }

    @DeleteMapping("/groups/{groupId}/join")
    public ApiResponse<FriendsResponse> leaveGroup(@CurrentUser User user, @PathVariable Long groupId) {
        return ApiResponse.ok("그룹에서 탈퇴했습니다.", friendService.leaveGroup(user, groupId));
    }

    @GetMapping("/groups/{groupId}")
    public ApiResponse<GroupDetailResponse> groupDetail(@CurrentUser User user, @PathVariable Long groupId) {
        return ApiResponse.ok("그룹 상세를 조회했습니다.", friendService.getGroupDetail(user, groupId));
    }

    @PostMapping("/groups/{groupId}/requests/{userId}/accept")
    public ApiResponse<GroupDetailResponse> acceptGroupRequest(@CurrentUser User user, @PathVariable Long groupId, @PathVariable Long userId) {
        return ApiResponse.ok("그룹 참가 신청을 수락했습니다.", friendService.acceptGroupRequest(user, groupId, userId));
    }

    @DeleteMapping("/groups/{groupId}/requests/{userId}")
    public ApiResponse<GroupDetailResponse> rejectGroupRequest(@CurrentUser User user, @PathVariable Long groupId, @PathVariable Long userId) {
        return ApiResponse.ok("그룹 참가 신청을 거절했습니다.", friendService.rejectGroupRequest(user, groupId, userId));
    }
}
