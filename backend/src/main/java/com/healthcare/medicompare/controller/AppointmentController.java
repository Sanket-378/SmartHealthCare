package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.entity.Appointment;
import com.healthcare.medicompare.repository.AppointmentRepository;
import com.healthcare.medicompare.repository.DoctorProfileRepository;
import com.healthcare.medicompare.repository.SlotRepository;
import com.healthcare.medicompare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final SlotRepository slotRepository;

    // ── GET PATIENT APPOINTMENTS ──
    // Returns all appointments for a patient, enriched with doctor + slot details
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<Map<String, Object>> result = buildAppointmentList(appointments, "patient");
        return ResponseEntity.ok(result);
    }

    // ── GET DOCTOR APPOINTMENTS ──
    // Returns all appointments for a doctor, enriched with patient + slot details
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        List<Map<String, Object>> result = buildAppointmentList(appointments, "doctor");
        return ResponseEntity.ok(result);
    }

    // ── CANCEL APPOINTMENT ──
    // Cancels an appointment and frees the slot
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId) {
        return appointmentRepository.findById(appointmentId).map(appt -> {
            if ("CANCELLED".equals(appt.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Appointment is already cancelled"));
            }
            if ("COMPLETED".equals(appt.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Cannot cancel a completed appointment"));
            }

            // Free up the slot
            slotRepository.findById(appt.getSlotId()).ifPresent(slot -> {
                slot.setIsBooked(false);
                slotRepository.save(slot);
            });

            appt.setStatus("CANCELLED");
            appointmentRepository.save(appt);

            return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
        }).orElse(ResponseEntity.badRequest()
                .body(Map.of("message", "Appointment not found")));
    }

    // ── MARK APPOINTMENT COMPLETED (Doctor action) ──
    @PutMapping("/{appointmentId}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId) {
        return appointmentRepository.findById(appointmentId).map(appt -> {
            if (!"CONFIRMED".equals(appt.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Only confirmed appointments can be marked completed"));
            }
            appt.setStatus("COMPLETED");
            appointmentRepository.save(appt);
            return ResponseEntity.ok(Map.of("message", "Appointment marked as completed"));
        }).orElse(ResponseEntity.badRequest()
                .body(Map.of("message", "Appointment not found")));
    }

    // ── HELPER: build enriched appointment list ──
    private List<Map<String, Object>> buildAppointmentList(List<Appointment> appointments, String viewAs) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Appointment appt : appointments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", appt.getId());
            map.put("status", appt.getStatus());
            map.put("notes", appt.getNotes());
            map.put("createdAt", appt.getCreatedAt());

            // Slot details
            slotRepository.findById(appt.getSlotId()).ifPresent(slot -> {
                map.put("slotId", slot.getId());
                map.put("date", slot.getSlotDate().toString());
                map.put("time", slot.getStartTime().toString());
                map.put("endTime", slot.getEndTime().toString());
            });

            // Doctor details
            userRepository.findById(appt.getDoctorId()).ifPresent(doctor -> {
                map.put("doctorId", doctor.getId());
                map.put("doctorName", doctor.getName());
                doctorProfileRepository.findByUserId(doctor.getId()).ifPresent(profile -> {
                    map.put("specialization", profile.getSpecialization());
                    map.put("clinicName", profile.getClinicName());
                    map.put("city", profile.getCity());
                    map.put("fee", profile.getFee());
                });
            });

            // Patient details
            userRepository.findById(appt.getPatientId()).ifPresent(patient -> {
                map.put("patientId", patient.getId());
                map.put("patientName", patient.getName());
                map.put("patientPhone", patient.getPhone());
                map.put("patientAge", patient.getAge());
                map.put("patientCity", patient.getCity());
            });

            result.add(map);
        }

        // Sort: CONFIRMED first, then by date desc
        result.sort((a, b) -> {
            String statusA = (String) a.get("status");
            String statusB = (String) b.get("status");
            int statusOrder = statusPriority(statusA) - statusPriority(statusB);
            if (statusOrder != 0) return statusOrder;
            String dateA = (String) a.getOrDefault("date", "");
            String dateB = (String) b.getOrDefault("date", "");
            return dateB.compareTo(dateA);
        });

        return result;
    }

    private int statusPriority(String status) {
        return switch (status) {
            case "CONFIRMED"  -> 0;
            case "COMPLETED"  -> 1;
            case "CANCELLED"  -> 2;
            default           -> 3;
        };
    }
}