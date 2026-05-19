package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")

@CrossOrigin(
        origins = "http://localhost:5173"
)

public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request
    ) {

        String message = request.get("message");

        String reply = aiService.getAIResponse(message);

        return Map.of(
                "reply",
                reply
        );
    }
}