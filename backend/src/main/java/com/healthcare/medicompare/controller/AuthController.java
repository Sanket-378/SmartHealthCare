package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.entity.DoctorProfile;
import com.healthcare.medicompare.entity.User;
import com.healthcare.medicompare.repository.DoctorProfileRepository;
import com.healthcare.medicompare.repository.UserRepository;
import com.healthcare.medicompare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── PATIENT REGISTER ──
    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        User user = new User();
        user.setName((String) request.get("name"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode((String) request.get("password")));
        user.setPhone((String) request.get("phone"));
        user.setRole("PATIENT");
        user.setStatus("ACTIVE");

        Object age = request.get("age");
        if (age != null && !age.toString().isEmpty()) {
            user.setAge(Integer.parseInt(age.toString()));
        }
        user.setCity((String) request.get("city"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Patient registered successfully"));
    }

    // ── DOCTOR REGISTER ──
    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("specialization") String specialization,
            @RequestParam("qualification") String qualification,
            @RequestParam("experience") String experience,
            @RequestParam("clinicName") String clinicName,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("pincode") String pincode,
            @RequestParam("fee") String fee,
            @RequestParam("license") MultipartFile license) {

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        // Save user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole("DOCTOR");
        user.setStatus("PENDING");
        User savedUser = userRepository.save(user);

        // Save license file
        String licenseUrl = "";
        try {
            String uploadDir = "uploads/licenses/";
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = UUID.randomUUID() + "_" + license.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, license.getBytes());
            licenseUrl = uploadDir + fileName;
        } catch (IOException e) {
            licenseUrl = "upload-failed";
        }

        // Save doctor profile
        DoctorProfile profile = new DoctorProfile();
        profile.setUserId(savedUser.getId());
        profile.setSpecialization(specialization);
        profile.setQualification(qualification);
        profile.setExperience(experience);
        profile.setClinicName(clinicName);
        profile.setAddress(address);
        profile.setCity(city);
        profile.setPincode(pincode);
        profile.setFee(Double.parseDouble(fee));
        profile.setLicenseUrl(licenseUrl);
        profile.setVerifiedStatus("PENDING");
        doctorProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Doctor registered successfully. Awaiting admin approval."));
    }

    // ── LOGIN ──
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String role = request.get("role");

        Optional<User> userOpt = userRepository.findByEmailAndRole(email, role);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email or role"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid password"));
        }

        if ("DOCTOR".equals(role) && !"ACTIVE".equals(user.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Your account is pending approval by admin"));
        }

        String token = jwtUtil.generateToken(email, role);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        userMap.put("status", user.getStatus());

        return ResponseEntity.ok(Map.of("token", token, "user", userMap));
    }

    
}