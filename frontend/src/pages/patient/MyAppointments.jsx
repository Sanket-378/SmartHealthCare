import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const S = {
    page: { maxWidth:1100 },
    title: { fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc: { fontSize:15, color:"#7da895", marginBottom:32, lineHeight:1.7 },
    tabs: { display:"flex", gap:4, marginBottom:24, background:"#0c1812",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:4, width:"fit-content" },
    tab: { padding:"8px 20px", borderRadius:9, fontSize:13, fontWeight:500,
        cursor:"pointer", border:"none", transition:"all 0.2s", fontFamily:"DM Sans,sans-serif" },
    tabActive: { background:"#0dce8f", color:"#000", fontWeight:700 },
    tabInactive: { background:"transparent", color:"#7da895" },
    apptList: { display:"flex", flexDirection:"column", gap:14 },
    apptCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"20px", display:"flex",
        alignItems:"flex-start", gap:16, transition:"border-color 0.2s",
    },
    apptIcon: {
        width:52, height:52, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:14,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:24, flexShrink:0,
    },
    apptInfo: { flex:1 },
    apptDoctor: { fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e4f2ec", marginBottom:4 },
    apptSpec: { fontSize:13, color:"#0dce8f", marginBottom:6 },
    apptMeta: { display:"flex", gap:16, flexWrap:"wrap" },
    apptMetaItem: { fontSize:12, color:"#7da895", display:"flex", alignItems:"center", gap:4 },
    apptRight: { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, flexShrink:0 },
    badge: { fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:8 },
    cancelBtn: {
        padding:"8px 16px", background:"rgba(255,77,109,0.10)",
        border:"1px solid rgba(255,77,109,0.25)", borderRadius:8,
        color:"#ff4d6d", fontSize:12, fontWeight:600,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    emptyState: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"60px 24px", textAlign:"center",
        color:"#456659", fontSize:14, lineHeight:1.8,
    },
    bookBtn: {
        display:"inline-block", marginTop:16, padding:"10px 24px",
        background:"#0dce8f", border:"none", borderRadius:10,
        color:"#000", fontSize:13, fontWeight:700,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
}

// Mock appointments — replace with real API later
const MOCK_UPCOMING = [
    {
        id:1, doctor:"Dr. Amit Sharma", specialization:"Cardiologist",
        date:"2026-05-24", time:"10:30 AM", clinic:"City Care Clinic",
        city:"Pune", fee:500, status:"CONFIRMED",
    },
    {
        id:2, doctor:"Dr. Priya Patel", specialization:"Dermatologist",
        date:"2026-05-25", time:"2:00 PM", clinic:"Skin Care Centre",
        city:"Mumbai", fee:400, status:"CONFIRMED",
    },
]

const MOCK_PAST = [
    {
        id:3, doctor:"Dr. Sneha Joshi", specialization:"General Physician",
        date:"2026-05-10", time:"11:00 AM", clinic:"Family Health Clinic",
        city:"Pune", fee:200, status:"COMPLETED",
    },
    {
        id:4, doctor:"Dr. Rahul Mehta", specialization:"Neurologist",
        date:"2026-05-05", time:"3:00 PM", clinic:"Brain & Spine Clinic",
        city:"Nashik", fee:800, status:"CANCELLED",
    },
]

function AppointmentCard({ appt, onCancel }) {
    const isUpcoming = appt.status === "CONFIRMED"
    const badgeColor = {
        CONFIRMED:  { bg:"rgba(13,206,143,0.12)",  color:"#0dce8f" },
        COMPLETED:  { bg:"rgba(77,166,255,0.12)",   color:"#4da6ff" },
        CANCELLED:  { bg:"rgba(255,77,109,0.12)",   color:"#ff4d6d" },
    }[appt.status] || { bg:"rgba(255,255,255,0.07)", color:"#7da895" }

    return (
        <div style={S.apptCard}>
            <div style={S.apptIcon}>👨‍⚕️</div>
            <div style={S.apptInfo}>
                <div style={S.apptDoctor}>{appt.doctor}</div>
                <div style={S.apptSpec}>{appt.specialization}</div>
                <div style={S.apptMeta}>
                    <div style={S.apptMetaItem}>📅 {new Date(appt.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</div>
                    <div style={S.apptMetaItem}>🕐 {appt.time}</div>
                    <div style={S.apptMetaItem}>📍 {appt.clinic}, {appt.city}</div>
                    <div style={S.apptMetaItem}>💰 ₹{appt.fee} at clinic</div>
                </div>
            </div>
            <div style={S.apptRight}>
                <div style={{ ...S.badge, background:badgeColor.bg, color:badgeColor.color }}>
                    {appt.status}
                </div>
                {isUpcoming && (
                    <button
                        style={S.cancelBtn}
                        onClick={() => onCancel(appt.id)}
                        onMouseEnter={e => e.currentTarget.style.background="rgba(255,77,109,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background="rgba(255,77,109,0.10)"}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}

export default function MyAppointments() {
    const navigate  = useNavigate()
    const { user }  = useAuth()
    const [tab, setTab]             = useState("upcoming")
    const [upcoming, setUpcoming]   = useState(MOCK_UPCOMING)
    const [past, setPast]           = useState(MOCK_PAST)

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            setUpcoming(p => p.filter(a => a.id !== id))
        }
    }

    const current = tab === "upcoming" ? upcoming : past

    return (
        <div style={S.page}>
            <h1 style={S.title}>My <span style={S.green}>Appointments</span></h1>
            <p style={S.desc}>View and manage all your booked appointments.</p>

            {/* Tabs */}
            <div style={S.tabs}>
                <button
                    style={{ ...S.tab, ...(tab === "upcoming" ? S.tabActive : S.tabInactive) }}
                    onClick={() => setTab("upcoming")}
                >
                    Upcoming ({upcoming.length})
                </button>
                <button
                    style={{ ...S.tab, ...(tab === "past" ? S.tabActive : S.tabInactive) }}
                    onClick={() => setTab("past")}
                >
                    Past ({past.length})
                </button>
            </div>

            {/* Appointment list */}
            {current.length === 0 ? (
                <div style={S.emptyState}>
                    📅<br/><br/>
                    {tab === "upcoming"
                        ? "No upcoming appointments.\nBook one now!"
                        : "No past appointments found."}
                    {tab === "upcoming" && (
                        <div>
                            <button style={S.bookBtn} onClick={() => navigate("/patient/find-doctor")}>
                                Find a Doctor →
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={S.apptList}>
                    {current.map(appt => (
                        <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} />
                    ))}
                </div>
            )}
        </div>
    )
}