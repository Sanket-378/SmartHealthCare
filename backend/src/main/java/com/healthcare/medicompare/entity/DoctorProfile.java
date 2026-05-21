package com.healthcare.medicompare.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String specialization;
    private String qualification;
    private String experience;

    @Column(name = "clinic_name")
    private String clinicName;

    private String address;
    private String city;
    private String pincode;
    private Double fee;

    @Column(name = "license_url")
    private String licenseUrl;

    @Column(name = "verified_status")
    private String verifiedStatus = "PENDING";

    private Double rating = 0.0;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}