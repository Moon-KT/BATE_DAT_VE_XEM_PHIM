package org.example.final_btl_datve.dto;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VerificationCodeStorage {
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    public void storeVerificationCode(String email, String code) {
        verificationCodes.put(email, code);
    }

    public String getVerificationCode(String email) {
        return verificationCodes.get(email);
    }

    public void removeVerificationCode(String email) {
        verificationCodes.remove(email);
    }
}
