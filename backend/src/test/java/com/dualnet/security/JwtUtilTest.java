package com.dualnet.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String TEST_SECRET =
            "DualNetTestSecretKey2024ForTestingPurposesOnly1234567890";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L);
    }

    @Test
    void generateToken_enthältKorrekteUserId() {
        String token = jwtUtil.generateToken("user-42");

        assertThat(jwtUtil.extractUserId(token)).isEqualTo("user-42");
    }

    @Test
    void isTokenValid_mitAbgelaufenemToken_gibtFalseZurueck() {
        ReflectionTestUtils.setField(jwtUtil, "expiration", 0L);
        String expiredToken = jwtUtil.generateToken("user-42");

        assertThat(jwtUtil.isTokenValid(expiredToken)).isFalse();
    }
}
