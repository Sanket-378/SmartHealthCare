package com.healthcare.medicompare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class MedicineService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://api.groq.com/openai/v1")
                    .build();

    public String getMedicineInfo(
            String medicineName
    ) {

        try {

            Map<String, Object> requestBody =
                    Map.of(

                            "model",
                            "llama-3.3-70b-versatile",

                            "messages",
                            List.of(

                                    Map.of(
                                            "role",
                                            "system",

                                            "content",

                                            """
                                            You are a Medicine Information Assistant.

                                            Rules:
                                            - Give short and beginner-friendly medicine information.
                                            - Mention:
                                            1. Uses
                                            2. Dosage
                                            3. Side Effects
                                            4. Warnings
                                            5. Doctor Advice

                                            - Use bullet points.
                                            - Maximum 6 points.
                                            - Use simple English.
                                            - Never prescribe dangerous medicines.
                                            - Educational purpose only.
                                            """
                                    ),

                                    Map.of(
                                            "role",
                                            "user",

                                            "content",

                                            "Give medicine information for: "
                                                    + medicineName
                                    )
                            )
                    );

            Map response =
                    webClient.post()

                            .uri("/chat/completions")

                            .header(
                                    HttpHeaders.AUTHORIZATION,
                                    "Bearer " + groqApiKey
                            )

                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )

                            .bodyValue(requestBody)

                            .retrieve()

                            .bodyToMono(Map.class)

                            .block();

            List choices =
                    (List) response.get("choices");

            Map choice =
                    (Map) choices.get(0);

            Map messageMap =
                    (Map) choice.get("message");

            return messageMap
                    .get("content")
                    .toString();

        } catch (Exception e) {

            e.printStackTrace();

            return "Unable to fetch medicine information.";
        }
    }
}