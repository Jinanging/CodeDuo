package com.codeduo.friend.controller;

import com.codeduo.friend.dto.FriendDtos.FriendsResponse;
import com.codeduo.friend.service.FriendService;
import com.codeduo.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Friend")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendService friendService;

    @GetMapping
    public ApiResponse<FriendsResponse> friends() {
        return ApiResponse.ok("친구와 그룹을 조회했습니다.", friendService.getFriends());
    }
}
