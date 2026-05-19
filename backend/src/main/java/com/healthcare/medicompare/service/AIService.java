package com.healthcare.medicompare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.List;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com/openai/v1")
            .build();

    public String getAIResponse(String message) {

        Map<String, Object> requestBody = Map.of(

                "model", "llama-3.3-70b-versatile",

                "messages", List.of(

                        // SYSTEM PROMPT
                        Map.of(
                                "role", "system",
                                "content",

                                """
                        You are an AI Healthcare Assistant for the HealthSetu platform.

                        Your job is to provide short, simple, and beginner-friendly healthcare guidance.

                        STRICT RESPONSE RULES:
                           - Keep answers very short.
                           - Maximum 7 points only.
                            - Use bullet points.
                            - Each point should be 1 short sentence.
                            - Avoid long paragraphs.
- Use very simple English.
- Do not use difficult medical terms.
- Highlight important warnings separately.
- If symptoms are serious, advise doctor consultation.

MEDICINE RULES:
- Suggest only common over-the-counter medicines when safe.
- Never prescribe strong prescription medicines.
- Always mention dosage carefully and generally.
- Add safety disclaimer when needed.

RESPONSE FORMAT:
1. Possible cause
2. Basic care tips
3. Safe medicine suggestion (if applicable)
4. Emergency warning signs
5. Doctor consultation advice

DO NOT:
- Write essays
- Write huge paragraphs
- Give more than 7 points
- Repeat information
- Use unnecessary explanation

Always keep answers clean, short, and easy to scan on mobile screens.
"""
                        ),
                        // USER MESSAGE
                        Map.of(
                                "role", "user",
                                "content", message
                        )
                )
        );

        Map response = webClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + groqApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List choices = (List) response.get("choices");
        Map choice = (Map) choices.get(0);
        Map messageMap = (Map) choice.get("message");

        return messageMap.get("content").toString();
    }
}