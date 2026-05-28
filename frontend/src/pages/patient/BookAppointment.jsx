import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const S = {
    page: { maxWidth:900 },
    title: { fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc: { fontSize:15, color:"#7da895", marginBottom:28, lineHeight:1.7 },
    docCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:14, padding:"18px 20px", marginBottom:28,
        display:"flex", alignItems:"center", gap:14,
        position:"relative", overflow:"hidden",
    },
    docCardLine: {
        position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    docAvatar: {
        width:52, height:52, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:13,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:24, flexShrink:0,
    },
    docName: { fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e4f2ec" },
    docSpec: { fontSize:13, color:"#0dce8f", marginTop:2 },
    docMeta: { fontSize:12, color:"#7da895", marginTop:3 },
    feeBadge: {
        marginLeft:"auto", background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:10,
        padding:"8px 16px", textAlign:"center", flexShrink:0,
    },
    feeNum: { fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:"#0dce8f" },
    feeLabel: { fontSize:10, color:"#7da895", marginTop:2 },
    steps: { display:"flex", gap:0, marginBottom:28 },
    sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:"1.8px", color:"#456659", textTransform:"uppercase", marginBottom:14 },
    dateGrid: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:28 },
    dateCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:12, padding:"12px 8px", textAlign:"center", cursor:"pointer", transition:"all 0.2s",
    },
    dateCardActive: { background:"rgba(13,206,143,0.12)", border:"1px solid rgba(13,206,143,0.35)" },
    dateDay: { fontSize:11, color:"#456659", marginBottom:4, textTransform:"uppercase" },
    dateNum: { fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:700, color:"#e4f2ec" },
    dateMonth: { fontSize:11, color:"#7da895", marginTop:2 },
    slotGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:28 },
    slotBtn: {
        padding:"10px 8px", borderRadius:10, fontSize:13, fontWeight:500,
        textAlign:"center", cursor:"pointer", transition:"all 0.2s",
        border:"1px solid rgba(255,255,255,0.08)", background:"#0c1812",
        color:"#7da895", fontFamily:"DM Sans,sans-serif",
    },
    slotBtnActive: { background:"rgba(13,206,143,0.12)", border:"1px solid rgba(13,206,143,0.35)", color:"#0dce8f", fontWeight:600 },
    slotBtnBooked: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", color:"#456659", cursor:"not-allowed" },
    confirmCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:14, padding:"24px", marginBottom:24,
    },
    confirmRow: { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:14 },
    confirmLabel: { color:"#7da895" },
    confirmVal: { color:"#e4f2ec", fontWeight:500 },
    confirmBtn: {
        width:"100%", padding:14, background:"#0dce8f", border:"none",
        borderRadius:12, fontSize:15, fontWeight:700, color:"#000",
        cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
    backBtn: {
        flex:1, padding:14, background:"transparent",
        border:"1px solid rgba(255,255,255,0.15)", borderRadius:12,
        fontSize:14, fontWeight:600, color:"#7da895",
        cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
    successCard: {
        background:"rgba(13,206,143,0.07)", border:"1px solid rgba(13,206,143,0.25)",
        borderRadius:16, padding:"40px 32px", textAlign:"center",
    },
    successIcon: { fontSize:60, marginBottom:16 },
    successTitle: { fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#0dce8f", marginBottom:10 },
    successText: { fontSize:14, color:"#7da895", lineHeight:1.7, marginBottom:24 },
    successDetails: {
        background:"#0c1812", borderRadius:12, padding:"16px 20px",
        textAlign:"left", marginBottom:24, display:"flex", flexDirection:"column", gap:8,
    },
    successDetailRow: { display:"flex", justifyContent:"space-between", fontSize:13 },
}

function getNext5Days() {
    const days = []
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    for (let i = 1; i <= 5; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        days.push({
            key: d.toISOString().split("T")[0],
            day: dayNames[d.getDay()],
            num: d.getDate(),
            month: monthNames[d.getMonth()],
        })
    }
    return days
}

export default function BookAppointment() {
    const { doctorId }  = useParams()
    const navigate      = useNavigate()
    const { user }      = useAuth()
    const days          = getNext5Days()

    const [doctor, setDoctor]         = useState(null)
    const [slots, setSlots]           = useState([])
    const [step, setStep]             = useState(1)
    const [selectedDate, setDate]     = useState(null)
    const [selectedSlot, setSlot]     = useState(null)
    const [loading, setLoading]       = useState(false)
    const [bookingDone, setBookingDone] = useState(false)

    useEffect(() => {
        fetchDoctor()
    }, [doctorId])

    useEffect(() => {
        if (selectedDate) fetchSlots(selectedDate)
    }, [selectedDate])

    const fetchDoctor = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/doctors")
            const data = await res.json()
            const found = data.find(d => d.id === parseInt(doctorId))
            setDoctor(found)
        } catch (err) {
            console.error("Failed to fetch doctor:", err)
        }
    }

    const fetchSlots = async (date) => {
        try {
            const res = await fetch(`http://localhost:8080/api/slots/doctor/${doctorId}/date/${date}`)
            const data = await res.json()
            setSlots(data)
        } catch (err) {
            console.error("Failed to fetch slots:", err)
        }
    }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8080/api/auth/appointments/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: user.id,
                    doctorId: parseInt(doctorId),
                    slotId: selectedSlot.id,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Booking failed")
            setBookingDone(true)
            setStep(4)
        } catch (err) {
            alert(err.message || "Failed to book appointment")
        } finally {
            setLoading(false)
        }
    }

    const stepInfo = [
        { num:1, label:"Pick date" },
        { num:2, label:"Pick slot" },
        { num:3, label:"Confirm" },
    ]

    if (!doctor) {
        return (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
                <div style={{ textAlign:"center", color:"#7da895" }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🔄</div>
                    <div>Loading doctor details...</div>
                </div>
            </div>
        )
    }

    if (step === 4) {
        return (
            <div style={S.page} className="page-enter">
                <div style={S.successCard}>
                    <div style={S.successIcon}>🎉</div>
                    <div style={S.successTitle}>Appointment Booked!</div>
                    <div style={S.successText}>
                        Your appointment has been confirmed. Please arrive 10 minutes early.
                        Pay the consultation fee at the clinic.
                    </div>
                    <div style={S.successDetails}>
                        {[
                            { label:"Doctor",   val:doctor.name },
                            { label:"Date",     val:selectedDate },
                            { label:"Time",     val:selectedSlot?.startTime },
                            { label:"Clinic",   val:doctor.clinicName },
                            { label:"City",     val:doctor.city },
                            { label:"Fee",      val:`₹${doctor.fee} (pay at clinic)` },
                        ].map(({ label, val }) => (
                            <div key={label} style={S.successDetailRow}>
                                <span style={{ color:"#7da895" }}>{label}</span>
                                <span style={{ color:"#e4f2ec", fontWeight:500 }}>{val}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display:"flex", gap:12 }}>
                        <button onClick={() => navigate("/patient/dashboard")} style={{ ...S.confirmBtn, flex:1 }}>
                            Go to Dashboard
                        </button>
                        <button onClick={() => navigate("/patient/find-doctor")} style={{ ...S.backBtn }}>
                            Find Another Doctor
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={S.page} className="page-enter">
            <h1 style={S.title}>Book <span style={S.green}>Appointment</span></h1>
            <p style={S.desc}>Select a date and time slot that works for you.</p>

            {/* Doctor summary */}
            <div style={S.docCard}>
                <div style={S.docCardLine} />
                <div style={S.docAvatar}>👨‍⚕️</div>
                <div>
                    <div style={S.docName}>{doctor.name}</div>
                    <div style={S.docSpec}>{doctor.specialization}</div>
                    <div style={S.docMeta}>📍 {doctor.clinicName}, {doctor.city}</div>
                </div>
                <div style={S.feeBadge}>
                    <div style={S.feeNum}>₹{doctor.fee}</div>
                    <div style={S.feeLabel}>Pay at clinic</div>
                </div>
            </div>

            {/* Steps */}
            <div style={S.steps}>
                {stepInfo.map((s, i) => (
                    <div key={s.num} style={{ display:"flex", alignItems:"center", flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{
                                width:28, height:28, borderRadius:"50%", display:"flex",
                                alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0,
                                background: step >= s.num ? "#0dce8f" : "rgba(255,255,255,0.07)",
                                color: step >= s.num ? "#000" : "#456659",
                            }}>
                                {step > s.num ? "✓" : s.num}
                            </div>
                            <span style={{ fontSize:12, fontWeight:500, color: step >= s.num ? "#e4f2ec" : "#456659" }}>
                {s.label}
              </span>
                        </div>
                        {i < stepInfo.length - 1 && (
                            <div style={{ flex:1, height:1, background: step > s.num ? "#0dce8f" : "rgba(255,255,255,0.08)", margin:"0 12px" }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1 — Pick date */}
            {step === 1 && (
                <div>
                    <div style={S.sectionLabel}>Select a date</div>
                    <div style={S.dateGrid}>
                        {days.map(d => (
                            <div
                                key={d.key}
                                style={selectedDate === d.key ? { ...S.dateCard, ...S.dateCardActive } : S.dateCard}
                                onClick={() => { setDate(d.key); setSlot(null) }}
                            >
                                <div style={S.dateDay}>{d.day}</div>
                                <div style={{ ...S.dateNum, color: selectedDate === d.key ? "#0dce8f" : "#e4f2ec" }}>{d.num}</div>
                                <div style={S.dateMonth}>{d.month}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        style={{ ...S.confirmBtn, opacity: selectedDate ? 1 : 0.4, cursor: selectedDate ? "pointer" : "not-allowed" }}
                        disabled={!selectedDate}
                        onClick={() => setStep(2)}
                    >
                        Continue — Select Time Slot →
                    </button>
                </div>
            )}

            {/* Step 2 — Pick slot */}
            {step === 2 && (
                <div>
                    <div style={S.sectionLabel}>
                        Available slots — {days.find(d => d.key === selectedDate)?.day} {days.find(d => d.key === selectedDate)?.num} {days.find(d => d.key === selectedDate)?.month}
                    </div>
                    {slots.length === 0 ? (
                        <div style={{ padding:"32px", textAlign:"center", color:"#456659", fontSize:14 }}>
                            No slots available for this date. Please pick another date.
                        </div>
                    ) : (
                        <div style={S.slotGrid}>
                            {slots.map(slot => (
                                <button
                                    key={slot.id}
                                    disabled={slot.isBooked}
                                    style={
                                        slot.isBooked ? S.slotBtnBooked :
                                            selectedSlot?.id === slot.id ? { ...S.slotBtn, ...S.slotBtnActive } :
                                                S.slotBtn
                                    }
                                    onClick={() => !slot.isBooked && setSlot(slot)}
                                >
                                    {slot.startTime}
                                    {slot.isBooked && <div style={{ fontSize:10, color:"#456659" }}>Booked</div>}
                                </button>
                            ))}
                        </div>
                    )}
                    <div style={{ display:"flex", gap:12 }}>
                        <button style={S.backBtn} onClick={() => setStep(1)}>← Back</button>
                        <button
                            style={{ ...S.confirmBtn, flex:2, opacity: selectedSlot ? 1 : 0.4, cursor: selectedSlot ? "pointer" : "not-allowed" }}
                            disabled={!selectedSlot}
                            onClick={() => setStep(3)}
                        >
                            Continue — Confirm Details →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
                <div>
                    <div style={S.sectionLabel}>Confirm your booking</div>
                    <div style={S.confirmCard}>
                        {[
                            { label:"Doctor",         val:doctor.name },
                            { label:"Specialization", val:doctor.specialization },
                            { label:"Date",           val:selectedDate },
                            { label:"Time",           val:selectedSlot?.startTime },
                            { label:"Clinic",         val:doctor.clinicName },
                            { label:"City",           val:doctor.city },
                            { label:"Fee",            val:`₹${doctor.fee} — pay at clinic` },
                        ].map(({ label, val }, i, arr) => (
                            <div key={label} style={{ ...S.confirmRow, borderBottom: i === arr.length-1 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                                <span style={S.confirmLabel}>{label}</span>
                                <span style={{ ...S.confirmVal, color: label === "Fee" ? "#0dce8f" : "#e4f2ec" }}>{val}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        background:"rgba(255,179,71,0.07)", border:"1px solid rgba(255,179,71,0.2)",
                        borderRadius:10, padding:"12px 16px", fontSize:13, color:"#ffb347", marginBottom:20, lineHeight:1.6,
                    }}>
                        ℹ️ Please arrive 10 minutes before your appointment. Carry a valid ID and previous reports.
                    </div>
                    <div style={{ display:"flex", gap:12 }}>
                        <button style={S.backBtn} onClick={() => setStep(2)}>← Back</button>
                        <button
                            style={{ ...S.confirmBtn, flex:2 }}
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "✓ Confirm Appointment"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}