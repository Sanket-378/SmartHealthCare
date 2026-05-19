package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/report")

@CrossOrigin(origins = "http://localhost:5173")

public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/analyze")

    public ResponseEntity<?> analyzeReport(

            @RequestParam("file") MultipartFile file,

            @RequestParam("language") String language

    ) {

        try {

            String response =
                    reportService.analyzeReport(file, language);

            return ResponseEntity.ok(
                    Map.of("reply", response)
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}