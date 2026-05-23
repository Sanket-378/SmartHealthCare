package com.healthcare.medicompare.repository;

import com.healthcare.medicompare.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByDoctorId(Long doctorId);
    List<Slot> findByDoctorIdAndSlotDate(Long doctorId, LocalDate slotDate);
    List<Slot> findByDoctorIdAndIsBooked(Long doctorId, Boolean isBooked);
}