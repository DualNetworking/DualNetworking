package com.dualnet.service.mapper;

import com.dualnet.dto.UserProfileResponse;
import com.dualnet.model.User;
import org.springframework.stereotype.Component;

// Wandelt ein User-Modell in einen UserProfileResponse um.
// Wichtig: passwordHash und email werden bewusst NICHT übernommen.
@Component
public class UserMapper {

    public UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getBio() != null ? user.getBio() : "",
                user.getFollowers().size(),
                user.getFollowing().size()
        );
    }
}
