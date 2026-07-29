package com.codeduo.friend.service;

import com.codeduo.friend.dto.FriendDtos.Friend;
import com.codeduo.friend.dto.FriendDtos.FriendRequestsResponse;
import com.codeduo.friend.dto.FriendDtos.FriendsResponse;
import com.codeduo.friend.entity.Friendship;
import com.codeduo.friend.repository.FriendshipRepository;
import com.codeduo.friend.repository.StudyGroupJoinRequestRepository;
import com.codeduo.friend.repository.StudyGroupMemberRepository;
import com.codeduo.friend.repository.StudyGroupRepository;
import com.codeduo.friend.type.FriendshipStatus;
import com.codeduo.submission.repository.SubmissionRepository;
import com.codeduo.user.entity.User;
import com.codeduo.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FriendServiceTest {
    @Mock private UserRepository userRepository;
    @Mock private FriendshipRepository friendshipRepository;
    @Mock private StudyGroupRepository studyGroupRepository;
    @Mock private StudyGroupMemberRepository studyGroupMemberRepository;
    @Mock private StudyGroupJoinRequestRepository studyGroupJoinRequestRepository;
    @Mock private SubmissionRepository submissionRepository;

    private FriendService service;
    private User requester;
    private User addressee;

    @BeforeEach
    void setUp() {
        service = new FriendService(
                userRepository,
                friendshipRepository,
                studyGroupRepository,
                studyGroupMemberRepository,
                studyGroupJoinRequestRepository,
                submissionRepository
        );
        requester = User.builder()
                .id(1L)
                .email("requester@codeduo.dev")
                .nickname("requester")
                .avatar("RQ")
                .xp(120)
                .build();
        addressee = User.builder()
                .id(2L)
                .email("addressee@codeduo.dev")
                .nickname("addressee")
                .avatar("AD")
                .xp(300)
                .build();
    }

    @Test
    void addFriendCreatesPendingRequestInsteadOfImmediateFriendship() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(addressee));
        when(friendshipRepository.findBetweenUsers(1L, 2L)).thenReturn(Optional.empty());
        when(friendshipRepository.save(any(Friendship.class))).thenAnswer(invocation -> invocation.getArgument(0));
        stubEmptyFriendsResponseDependencies();

        FriendsResponse response = service.addFriend(requester, 2L);

        verify(friendshipRepository).save(argThat(friendship ->
                friendship.getRequester().equals(requester)
                        && friendship.getAddressee().equals(addressee)
                        && friendship.getStatus() == FriendshipStatus.PENDING
        ));
        assertThat(response.users()).isEmpty();
    }

    @Test
    void pendingRequestAppearsAsReceivedAndNotAsFriend() {
        Friendship pending = Friendship.builder()
                .id(10L)
                .requester(requester)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build();
        when(friendshipRepository.findAllByAddresseeIdAndStatus(2L, FriendshipStatus.PENDING)).thenReturn(List.of(pending));
        when(friendshipRepository.findAllByRequesterIdAndStatus(2L, FriendshipStatus.PENDING)).thenReturn(List.of());

        FriendRequestsResponse response = service.getRequests(addressee);

        assertThat(response.received()).hasSize(1);
        Friend requesterDto = response.received().get(0).user();
        assertThat(requesterDto.id()).isEqualTo("1");
        assertThat(requesterDto.friend()).isFalse();
        assertThat(requesterDto.relationStatus()).isEqualTo("received");
        assertThat(response.sent()).isEmpty();
    }

    @Test
    void acceptRequestMarksFriendshipAcceptedAndFriendListIncludesUser() {
        Friendship pending = Friendship.builder()
                .id(10L)
                .requester(requester)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build();
        when(friendshipRepository.findBetweenUsers(2L, 1L)).thenReturn(Optional.of(pending));
        when(friendshipRepository.findAllByUserId(2L)).thenReturn(List.of(pending));
        when(studyGroupMemberRepository.findAllByUserId(2L)).thenReturn(List.of());
        when(userRepository.findAll()).thenReturn(List.of(requester, addressee));
        when(studyGroupRepository.findAll()).thenReturn(List.of());

        FriendsResponse response = service.acceptRequest(addressee, 1L);

        assertThat(pending.getStatus()).isEqualTo(FriendshipStatus.ACCEPTED);
        assertThat(response.users())
                .singleElement()
                .satisfies(friend -> {
                    assertThat(friend.id()).isEqualTo("1");
                    assertThat(friend.friend()).isTrue();
                    assertThat(friend.relationStatus()).isEqualTo("friends");
                });
    }

    private void stubEmptyFriendsResponseDependencies() {
        when(friendshipRepository.findAllByUserId(1L)).thenReturn(List.of());
        when(studyGroupMemberRepository.findAllByUserId(1L)).thenReturn(List.of());
        when(userRepository.findAll()).thenReturn(List.of(requester));
        when(studyGroupRepository.findAll()).thenReturn(List.of());
    }
}
