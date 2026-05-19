package com.healthcare.medicompare.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Service
public class ReportService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final String API_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    public String analyzeReport(
            MultipartFile file,
            String language
    ) throws Exception {

        // =========================
        // EXTRACT PDF TEXT
        // =========================

        InputStream inputStream = file.getInputStream();

        PDDocument document =
                PDDocument.load(inputStream);

        PDFTextStripper stripper =
                new PDFTextStripper();

        String reportText =
                stripper.getText(document);

        document.close();

        // =========================
        // PROMPT
        // =========================

        String prompt = """

You are an AI healthcare assistant.

Analyze this medical report carefully.

Explain in VERY SIMPLE language:

1. What report says
2. Which values are abnormal
3. Possible disease
4. Health risks
5. Treatment suggestions
6. Diet suggestions
7. When patient should consult doctor

Rules:
- Keep response short
- Use bullet points
- Avoid complex medical terms
- Reply ONLY in """ + language + """

Medical Report:

""" + reportText;

        // =========================
        // REQUEST BODY
        // =========================

        Map<String, Object> requestBody =
                new HashMap<>();

        requestBody.put(
                "model",
                "llama-3.3-70b-versatile"
        );

        List<Map<String, String>> messages =
                new ArrayList<>();

        messages.add(
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        );

        requestBody.put("messages", messages);

        // =========================
        // HEADERS
        // =========================

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        // =========================
        // API CALL
        // =========================

        RestTemplate restTemplate =
                new RestTemplate();

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        API_URL,
                        entity,
                        Map.class
                );

        // =========================
        // RESPONSE
        // =========================

        Map choice =
                ((List<Map>) response.getBody()
                        .get("choices")).get(0);

        Map message =
                (Map) choice.get("message");

        return message.get("content").toString();
    }
}