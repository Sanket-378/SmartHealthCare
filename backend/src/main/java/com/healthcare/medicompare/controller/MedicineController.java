package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.service.MedicineService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/medicine")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @PostMapping("/search")
    public String getMedicineInfo(
            @RequestBody Map<String, String> request
    ) {

        String medicineName =
                request.get("medicine");

        return medicineService
                .getMedicineInfo(medicineName);
    }
}