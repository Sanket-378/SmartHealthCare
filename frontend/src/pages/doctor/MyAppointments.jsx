import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const API = "http://localhost:8080"

const S = {
    page: { minHeight:"100vh", background:"#080f0c", color:"#e4f2ec", padding:"32px 40px" },
    inner: { maxWidth:1100 },

    // Pending banner
    pendingBanner: {
        background:"rgba(255,179,71,0.08)", border:"1px solid rgba(255,179,71,0.25)",
        borderRadius:16, padding:"24px 28px", marginBottom:28,
        display:"flex", alignItems:"flex-start", gap:16,
    },
    pendingIcon: { fontSize:40, flexShrink:0 },
    pendingTitle: { fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800,
        color:"#ffb347", marginBottom:6 },
    pendingText: { fontSize:14, color:"#7da895", lineHeight:1.7 },
    pendingSteps: { display:"flex", flexDirection:"column", gap:8, marginTop:14 },
    pendingStep: { display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#7da895" },
    pendingStepDot: { width:6, height:6, background:"#ffb347", borderRadius:"50%", flexShrink:0 },

    // Welcome bar
    welcomeBar: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, padding:"24px 28px", marginBottom:28,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"relative", overflow:"hidden",
    },
    welcomeLine: {
        position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    welcomeTag: {
        display:"inline-flex", alignItems:"center", gap:6,
        background:"rgba(13,206,143,0.10)", border:"1px solid rgba(13,206,143,0.22)",
        borderRadius:20, padding:"4px 12px", fontSize:11,
        color:"#0dce8f", fontWeight:600, marginBottom:10,
    },
    welcomeTitle: { fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800,
        color:"#e4f2ec", marginBottom:6 },
    welcomeSub: { fontSize:14, color:"#7da895" },

    // Stats
    statsRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 },
    statCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:14, padding:20,
    },
    statIcon: { fontSize:28, marginBottom:10 },
    statNum: { fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800,
        color:"#0dce8f", marginBottom:4 },
    statLabel: { fontSize:12, color:"#7da895" },

    // Grid
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
    sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:"1.8px",
        color:"#456659", textTransform:"uppercase", marginBottom:14 },

    // Card
    card: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:14, overflow:"hidden",
    },
    cardHead: {
        padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
    },
    cardHeadTitle: { fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e4f2ec" },
    cardBody: { padding:16, display:"flex", flexDirection:"column", gap:10 },

    // Appointment item
    apptItem: {
        display:"flex", alignItems:"center", gap:14,
        background:"#13201a", borderRadius:12,
        padding:"14px 16px", border:"1px solid rgba(255,255,255,0.05)",
    },
    apptIconWrap: {
        width:44, height:44, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:12,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:20, flexShrink:0,
    },
    apptInfo: { flex:1 },
    apptName: { fontSize:14, fontWeight:600, color:"#e4f2ec", marginBottom:3 },
    apptDetail: { fontSize:12, color:"#7da895" },
    apptBadge: { fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6 },

    // Action buttons
    actionBtn: {
        display:"flex", alignItems:"center", gap:14,
        background:"#13201a", borderRadius:12,
        padding:"14px 16px", border:"1px solid rgba(255,255,255,0.05)",
        cursor:"pointer", transition:"all 0.2s", width:"100%",
        textAlign:"left", fontFamily:"DM Sans,sans-serif",
    },
    actionIcon: { width:40, height:40, borderRadius:10,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 },
    actionTitle: { fontSize:14, fontWeight:600, color:"#e4f2ec", marginBottom:2 },
    actionSub: { fontSize:12, color:"#7da895" },

    emptyState: { padding:"28px 20px", textAlign:"center", color:"#456659", fontSize:14 },
}

const QUICK_ACTIONS = [
    { icon:"🗓️", color:"rgba(13,206,143,0.12)", label:"Manage Slots",      sub:"Add or remove available time slots", path:"/doctor/slots" },
    { icon:"📋", color:"rgba(77,166,255,0.12)",  label:"My Appointments",   sub:"View all patient bookings",          path:"/doctor/appointments" },
    { icon:"👤", color:"rgba(255,179,71,0.12)",  label:"Edit Profile",      sub:"Update clinic info and fees",        path:"/doctor/profile" },
    { icon:"📊", color:"rgba(255,77,109,0.10)",  label:"View Analytics",    sub:"Patients seen, revenue this month",  path:"/doctor/analytics" },
]

export default function DoctorDashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loadingAppts, setLoadingAppts] = useState(true)

    const isPending = user?.status === "PENDING" || user?.doctorStatus === "PENDING"

    useEffect(() => {
        if (user?.id && !isPending) fetchAppointments()
        else setLoadingAppts(false)
    }, [user])

    const fetchAppointments = async () => {
        try {
            const res  = await fetch(`${API}/api/appointments/doctor/${user.id}`)
            const data = await res.json()
            setAppointments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch appointments:", err)
        } finally {
            setLoadingAppts(false)
        }
    }

    const today = new Date().toISOString().split("T")[0]
    const todayAppts   = appointments.filter(a => a.date === today && a.status === "CONFIRMED")
    const weekAppts    = appointments.filter(a => a.status === "CONFIRMED").length
    const totalDone    = appointments.filter(a => a.status === "COMPLETED").length

    return (
        <div style={S.page}>
            <div style={S.inner}>

                {/* Pending verification banner */}
                {isPending && (
                    <div style={S.pendingBanner}>
                        <div style={S.pendingIcon}>⏳</div>
                        <div>
                            <div style={S.pendingTitle}>Account Under Review</div>
                            <div style={S.pendingText}>
                                Your medical license has been submitted. Our admin team is
                                reviewing your documents. You will receive an email once approved.
                            </div>
                            <div style={S.pendingSteps}>
                                {[
                                    "License document uploaded successfully",
                                    "Admin review in progress — usually 24 to 48 hours",
                                    "You will get email notification after approval",
                                    "Once approved, you can set slots and accept patients",
                                ].map((step, i) => (
                                    <div key={i} style={S.pendingStep}>
                                        <span style={S.pendingStepDot} />
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Welcome bar */}
                <div style={S.welcomeBar}>
                    <div style={S.welcomeLine} />
                    <div>
                        <div style={S.welcomeTag}>
                            <span style={{ width:6, height:6, background:"#0dce8f", borderRadius:"50%" }} />
                            Doctor Portal
                        </div>
                        <div style={S.welcomeTitle}>
                            Welcome, {user?.name || "Doctor"} 👨‍⚕️
                        </div>
                        <div style={S.welcomeSub}>
                            {isPending
                                ? "Your account is being verified. You can explore the dashboard meanwhile."
                                : "Here is your schedule for today."}
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/doctor/slots")}
                        style={{
                            background:"#0dce8f", border:"none", borderRadius:12,
                            padding:"12px 24px", fontSize:14, fontWeight:700,
                            color:"#000", cursor:"pointer", fontFamily:"DM Sans,sans-serif",
                            flexShrink:0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity="1"}
                    >
                        + Add Slots
                    </button>
                </div>

                {/* Stats */}
                <div style={S.statsRow}>
                    {[
                        { icon:"👥", num: loadingAppts ? "…" : todayAppts.length,  label:"Patients today" },
                        { icon:"📅", num: loadingAppts ? "…" : weekAppts,           label:"Upcoming" },
                        { icon:"✅", num: loadingAppts ? "…" : totalDone,           label:"Total completed" },
                        { icon:"⭐", num: "—",                                       label:"Rating (soon)" },
                    ].map(({ icon, num, label }) => (
                        <div key={label} style={S.statCard}>
                            <div style={S.statIcon}>{icon}</div>
                            <div style={S.statNum}>{num}</div>
                            <div style={S.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Main grid */}
                <div style={S.grid2}>

                    {/* Today's appointments */}
                    <div>
                        <div style={S.sectionLabel}>Today's appointments</div>
                        <div style={S.card}>
                            <div style={S.cardHead}>
                                <div style={S.cardHeadTitle}>📅 Today</div>
                                <span style={{ fontSize:12, color:"#0dce8f", cursor:"pointer" }}
                                      onClick={() => navigate("/doctor/appointments")}>
                  View all →
                </span>
                            </div>
                            <div style={S.cardBody}>
                                {isPending ? (
                                    <div style={S.emptyState}>
                                        Appointments will appear here<br/>after your account is approved.
                                    </div>
                                ) : loadingAppts ? (
                                    <div style={S.emptyState}>Loading…</div>
                                ) : todayAppts.length === 0 ? (
                                    <div style={S.emptyState}>No appointments today.</div>
                                ) : todayAppts.slice(0, 3).map(a => (
                                    <div key={a.id} style={S.apptItem}>
                                        <div style={S.apptIconWrap}>🧑</div>
                                        <div style={S.apptInfo}>
                                            <div style={S.apptName}>{a.patientName}</div>
                                            <div style={S.apptDetail}>
                                                {a.patientAge ? `Age ${a.patientAge} · ` : ""}{a.time}
                                            </div>
                                        </div>
                                        <div style={{
                                            ...S.apptBadge,
                                            background:"rgba(13,206,143,0.12)",
                                            color:"#0dce8f",
                                        }}>
                                            {a.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div>
                        <div style={S.sectionLabel}>Quick actions</div>
                        <div style={S.card}>
                            <div style={S.cardBody}>
                                {QUICK_ACTIONS.map(({ icon, color, label, sub, path }) => (
                                    <button
                                        key={label}
                                        style={S.actionBtn}
                                        onClick={() => navigate(path)}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor="rgba(13,206,143,0.25)"
                                            e.currentTarget.style.background="#192820"
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor="rgba(255,255,255,0.05)"
                                            e.currentTarget.style.background="#13201a"
                                        }}
                                    >
                                        <div style={{ ...S.actionIcon, background:color }}>{icon}</div>
                                        <div>
                                            <div style={S.actionTitle}>{label}</div>
                                            <div style={S.actionSub}>{sub}</div>
                                        </div>
                                        <svg style={{ marginLeft:"auto", color:"#0dce8f", opacity:0.5 }}
                                             width="16" height="16" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div style={{ marginTop:28, textAlign:"right" }}>
                    <button
                        onClick={() => { logout(); window.location.href="/login" }}
                        style={{
                            background:"transparent", border:"1px solid rgba(255,77,109,0.3)",
                            borderRadius:10, padding:"10px 20px", color:"#ff4d6d",
                            fontSize:13, fontWeight:600, cursor:"pointer",
                            fontFamily:"DM Sans,sans-serif",
                        }}
                    >
                        Sign out
                    </button>
                </div>

            </div>
        </div>
    )
}