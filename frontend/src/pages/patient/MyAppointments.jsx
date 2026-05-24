import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const API = "http://localhost:8080"

const S = {
    page: { maxWidth:1100 },
    title: { fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc: { fontSize:15, color:"#7da895", marginBottom:32, lineHeight:1.7 },
    tabs: { display:"flex", gap:4, marginBottom:24, background:"#0c1812",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:4, width:"fit-content" },
    tab: { padding:"8px 20px", borderRadius:9, fontSize:13, fontWeight:500,
        cursor:"pointer", border:"none", transition:"all 0.2s", fontFamily:"DM Sans,sans-serif" },
    tabActive:   { background:"#0dce8f", color:"#000", fontWeight:700 },
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
    apptSpec:   { fontSize:13, color:"#0dce8f", marginBottom:6 },
    apptMeta:   { display:"flex", gap:16, flexWrap:"wrap" },
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
    spinner: { textAlign:"center", padding:"60px 0", color:"#456659", fontSize:14 },
    errorBanner: {
        background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.25)",
        borderRadius:10, padding:"12px 16px", fontSize:13, color:"#ff4d6d", marginBottom:20,
    },
}

const BADGE_COLORS = {
    CONFIRMED: { bg:"rgba(13,206,143,0.12)",  color:"#0dce8f" },
    COMPLETED: { bg:"rgba(77,166,255,0.12)",   color:"#4da6ff" },
    CANCELLED: { bg:"rgba(255,77,109,0.12)",   color:"#ff4d6d" },
}

function AppointmentCard({ appt, onCancel }) {
    const isUpcoming = appt.status === "CONFIRMED"
    const badge = BADGE_COLORS[appt.status] || { bg:"rgba(255,255,255,0.07)", color:"#7da895" }

    const formattedDate = appt.date
        ? new Date(appt.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })
        : "—"

    return (
        <div style={S.apptCard}>
            <div style={S.apptIcon}>👨‍⚕️</div>
            <div style={S.apptInfo}>
                <div style={S.apptDoctor}>{appt.doctorName || "Doctor"}</div>
                <div style={S.apptSpec}>{appt.specialization || ""}</div>
                <div style={S.apptMeta}>
                    <div style={S.apptMetaItem}>📅 {formattedDate}</div>
                    <div style={S.apptMetaItem}>🕐 {appt.time || "—"}</div>
                    {appt.clinicName && (
                        <div style={S.apptMetaItem}>📍 {appt.clinicName}{appt.city ? `, ${appt.city}` : ""}</div>
                    )}
                    {appt.fee != null && (
                        <div style={S.apptMetaItem}>💰 ₹{appt.fee} at clinic</div>
                    )}
                </div>
            </div>
            <div style={S.apptRight}>
                <div style={{ ...S.badge, background:badge.bg, color:badge.color }}>
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
    const navigate     = useNavigate()
    const { user }     = useAuth()
    const [tab, setTab]             = useState("upcoming")
    const [appointments, setAppts]  = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState("")

    useEffect(() => {
        if (user?.id) fetchAppointments()
    }, [user])

    const fetchAppointments = async () => {
        setLoading(true)
        setError("")
        try {
            const res  = await fetch(`${API}/api/appointments/patient/${user.id}`)
            if (!res.ok) throw new Error("Failed to load appointments")
            const data = await res.json()
            setAppts(data)
        } catch (err) {
            setError(err.message || "Could not load appointments. Is the backend running?")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return
        try {
            const res  = await fetch(`${API}/api/appointments/${appointmentId}/cancel`, { method:"PUT" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Cancel failed")
            // Optimistically update status in state
            setAppts(prev => prev.map(a =>
                a.id === appointmentId ? { ...a, status:"CANCELLED" } : a
            ))
        } catch (err) {
            alert(err.message || "Failed to cancel appointment")
        }
    }

    const upcoming = appointments.filter(a => a.status === "CONFIRMED")
    const past     = appointments.filter(a => a.status !== "CONFIRMED")
    const current  = tab === "upcoming" ? upcoming : past

    return (
        <div style={S.page} className="page-enter">
            <h1 style={S.title}>My <span style={S.green}>Appointments</span></h1>
            <p style={S.desc}>View and manage all your booked appointments.</p>

            {error && <div style={S.errorBanner}>⚠️ {error}</div>}

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

            {/* Content */}
            {loading ? (
                <div style={S.spinner}>⏳ Loading appointments...</div>
            ) : current.length === 0 ? (
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
