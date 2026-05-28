import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

const API = "http://localhost:8080"

const S = {
    page: { minHeight:"100vh", background:"#080f0c", color:"#e4f2ec", padding:"32px 40px" },
    inner: { maxWidth:1100 },
    title: { fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc:  { fontSize:15, color:"#7da895", marginBottom:32, lineHeight:1.7 },
    tabs: {
        display:"flex", gap:4, marginBottom:28, background:"#0c1812",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:4, width:"fit-content",
    },
    tab:        { padding:"8px 20px", borderRadius:9, fontSize:13, fontWeight:500,
        cursor:"pointer", border:"none", transition:"all 0.2s", fontFamily:"DM Sans,sans-serif" },
    tabActive:   { background:"#0dce8f", color:"#000", fontWeight:700 },
    tabInactive: { background:"transparent", color:"#7da895" },
    apptList: { display:"flex", flexDirection:"column", gap:14 },
    apptCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"20px 24px", display:"flex",
        alignItems:"flex-start", gap:16,
    },
    apptIcon: {
        width:52, height:52, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:14,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:24, flexShrink:0,
    },
    apptInfo:   { flex:1 },
    apptName:   { fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e4f2ec", marginBottom:4 },
    apptMeta:   { display:"flex", gap:16, flexWrap:"wrap" },
    apptMetaItem: { fontSize:12, color:"#7da895", display:"flex", alignItems:"center", gap:4 },
    apptRight:  { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, flexShrink:0 },
    badge:      { fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:8 },
    completeBtn: {
        padding:"8px 16px", background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.25)", borderRadius:8,
        color:"#0dce8f", fontSize:12, fontWeight:600,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    cancelBtn: {
        padding:"8px 16px", background:"rgba(255,77,109,0.10)",
        border:"1px solid rgba(255,77,109,0.25)", borderRadius:8,
        color:"#ff4d6d", fontSize:12, fontWeight:600,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    emptyState: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"60px 24px", textAlign:"center",
        color:"#456659", fontSize:14, lineHeight:2,
    },
    spinner:     { textAlign:"center", padding:"60px 0", color:"#456659", fontSize:14 },
    errorBanner: {
        background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.25)",
        borderRadius:10, padding:"12px 16px", fontSize:13, color:"#ff4d6d", marginBottom:20,
    },
    statsRow: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 },
    statCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:14, padding:20,
    },
    statIcon:  { fontSize:28, marginBottom:10 },
    statNum:   { fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, color:"#0dce8f", marginBottom:4 },
    statLabel: { fontSize:12, color:"#7da895" },
}

const BADGE_COLORS = {
    CONFIRMED: { bg:"rgba(13,206,143,0.12)", color:"#0dce8f" },
    COMPLETED: { bg:"rgba(77,166,255,0.12)",  color:"#4da6ff" },
    CANCELLED: { bg:"rgba(255,77,109,0.12)",  color:"#ff4d6d" },
}

function AppointmentCard({ appt, onComplete, onCancel }) {
    const badge = BADGE_COLORS[appt.status] || { bg:"rgba(255,255,255,0.07)", color:"#7da895" }
    const formattedDate = appt.date
        ? new Date(appt.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })
        : "—"

    return (
        <div style={S.apptCard}>
            <div style={S.apptIcon}>🧑</div>
            <div style={S.apptInfo}>
                <div style={S.apptName}>{appt.patientName || "Patient"}</div>
                <div style={S.apptMeta}>
                    {appt.patientAge && <div style={S.apptMetaItem}>👤 Age {appt.patientAge}</div>}
                    <div style={S.apptMetaItem}>📅 {formattedDate}</div>
                    <div style={S.apptMetaItem}>🕐 {appt.time || "—"}{appt.endTime ? ` – ${appt.endTime}` : ""}</div>
                    {appt.patientPhone && <div style={S.apptMetaItem}>📞 {appt.patientPhone}</div>}
                    {appt.patientCity  && <div style={S.apptMetaItem}>📍 {appt.patientCity}</div>}
                </div>
            </div>
            <div style={S.apptRight}>
                <div style={{ ...S.badge, background:badge.bg, color:badge.color }}>
                    {appt.status}
                </div>
                {appt.status === "CONFIRMED" && (
                    <div style={{ display:"flex", gap:8 }}>
                        <button
                            style={S.completeBtn}
                            onClick={() => onComplete(appt.id)}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(13,206,143,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background="rgba(13,206,143,0.10)"}
                        >
                            ✓ Done
                        </button>
                        <button
                            style={S.cancelBtn}
                            onClick={() => onCancel(appt.id)}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(255,77,109,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background="rgba(255,77,109,0.10)"}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function DoctorMyAppointments() {
    const { user }  = useAuth()
    const [tab, setTab]             = useState("upcoming")
    const [appointments, setAppts]  = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState("")

    useEffect(() => {
        if (user?.id) fetchAppointments()
    }, [user])

    const fetchAppointments = async () => {
        setLoading(true); setError("")
        try {
            const res  = await fetch(`${API}/api/appointments/doctor/${user.id}`)
            if (!res.ok) throw new Error("Failed to load appointments")
            const data = await res.json()
            setAppts(data)
        } catch (err) {
            setError(err.message || "Could not load appointments. Is the backend running?")
        } finally {
            setLoading(false)
        }
    }

    const handleComplete = async (id) => {
        if (!window.confirm("Mark this appointment as completed?")) return
        try {
            const res  = await fetch(`${API}/api/appointments/${id}/complete`, { method:"PUT" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setAppts(prev => prev.map(a => a.id === id ? { ...a, status:"COMPLETED" } : a))
        } catch (err) {
            alert(err.message || "Failed to mark complete")
        }
    }

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this appointment and free the slot?")) return
        try {
            const res  = await fetch(`${API}/api/appointments/${id}/cancel`, { method:"PUT" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setAppts(prev => prev.map(a => a.id === id ? { ...a, status:"CANCELLED" } : a))
        } catch (err) {
            alert(err.message || "Failed to cancel appointment")
        }
    }

    const upcoming  = appointments.filter(a => a.status === "CONFIRMED")
    const past      = appointments.filter(a => a.status !== "CONFIRMED")
    const completed = past.filter(a => a.status === "COMPLETED").length
    const current   = tab === "upcoming" ? upcoming : past

    return (
        <div style={S.page} className="page-enter">
            <div style={S.inner}>
                <h1 style={S.title}>My <span style={S.green}>Appointments</span></h1>
                <p style={S.desc}>View and manage all patient bookings.</p>

                {/* Stats */}
                <div style={S.statsRow}>
                    {[
                        { icon:"📅", num: loading ? "…" : upcoming.length,         label:"Upcoming" },
                        { icon:"✅", num: loading ? "…" : completed,               label:"Completed" },
                        { icon:"📊", num: loading ? "…" : appointments.length,     label:"Total" },
                    ].map(({ icon, num, label }) => (
                        <div key={label} style={S.statCard}>
                            <div style={S.statIcon}>{icon}</div>
                            <div style={S.statNum}>{num}</div>
                            <div style={S.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

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

                {/* List */}
                {loading ? (
                    <div style={S.spinner}>⏳ Loading appointments...</div>
                ) : current.length === 0 ? (
                    <div style={S.emptyState}>
                        📅<br/><br/>
                        {tab === "upcoming"
                            ? "No upcoming appointments.\nPatients can book your available slots."
                            : "No past appointments yet."}
                    </div>
                ) : (
                    <div style={S.apptList}>
                        {current.map(appt => (
                            <AppointmentCard
                                key={appt.id}
                                appt={appt}
                                onComplete={handleComplete}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}