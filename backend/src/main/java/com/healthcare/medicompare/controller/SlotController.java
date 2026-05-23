package com.healthcare.medicompare.controller;

import com.healthcare.medicompare.entity.Slot;
import com.healthcare.medicompare.repository.SlotRepository;
import com.healthcare.medicompare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SlotController {

    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    // ── ADD SLOTS ──
    @PostMapping("/add")
    public ResponseEntity<?> addSlots(@RequestBody Map<String, Object> request) {
        try {
            Long doctorId = Long.parseLong(request.get("doctorId").toString());
            String date = (String) request.get("date");
            String startTime = (String) request.get("startTime");
            String endTime = (String) request.get("endTime");
            int duration = Integer.parseInt(request.get("duration").toString());

            LocalDate slotDate = LocalDate.parse(date);
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);

            List<Slot> slots = new ArrayList<>();
            LocalTime current = start;

            while (current.plusMinutes(duration).compareTo(end) <= 0) {
                Slot slot = new Slot();
                slot.setDoctorId(doctorId);
                slot.setSlotDate(slotDate);
                slot.setStartTime(current);
                slot.setEndTime(current.plusMinutes(duration));
                slot.setIsBooked(false);
                slots.add(slot);
                current = current.plusMinutes(duration);
            }

            slotRepository.saveAll(slots);

            return ResponseEntity.ok(Map.of(
                    "message", "Slots added successfully",
                    "count", slots.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to add slots: " + e.getMessage()));
        }
    }

    // ── GET SLOTS BY DOCTOR ──
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorSlots(@PathVariable Long doctorId) {
        List<Slot> slots = slotRepository.findByDoctorId(doctorId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Slot slot : slots) {
            Map<String, Object> slotMap = new HashMap<>();
            slotMap.put("id", slot.getId());
            slotMap.put("date", slot.getSlotDate().toString());
            slotMap.put("startTime", slot.getStartTime().toString());
            slotMap.put("endTime", slot.getEndTime().toString());
            slotMap.put("isBooked", slot.getIsBooked());
            result.add(slotMap);
        }

        return ResponseEntity.ok(result);
    }

    // ── GET SLOTS BY DOCTOR AND DATE ──
    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<?> getSlotsByDate(
            @PathVariable Long doctorId,
            @PathVariable String date) {
        LocalDate slotDate = LocalDate.parse(date);
        List<Slot> slots = slotRepository.findByDoctorIdAndSlotDate(doctorId, slotDate);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Slot slot : slots) {
            Map<String, Object> slotMap = new HashMap<>();
            slotMap.put("id", slot.getId());
            slotMap.put("date", slot.getSlotDate().toString());
            slotMap.put("startTime", slot.getStartTime().toString());
            slotMap.put("endTime", slot.getEndTime().toString());
            slotMap.put("isBooked", slot.getIsBooked());
            result.add(slotMap);
        }

        return ResponseEntity.ok(result);
    }

    // ── DELETE SLOT ──
    @DeleteMapping("/{slotId}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId) {
        return slotRepository.findById(slotId).map(slot -> {
            if (slot.getIsBooked()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Cannot delete a booked slot"));
            }
            slotRepository.delete(slot);
            return ResponseEntity.ok(Map.of("message", "Slot deleted successfully"));
        }).orElse(ResponseEntity.badRequest()
                .body(Map.of("message", "Slot not found")));
    }
}