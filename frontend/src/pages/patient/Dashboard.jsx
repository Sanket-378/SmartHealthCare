import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const S = {
    page: { maxWidth: 1100 },

    // Top welcome bar
    welcomeBar: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "24px 28px", marginBottom: 28,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 20,
        position: "relative", overflow: "hidden",
    },
    welcomeLine: {
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    welcomeLeft: {},
    welcomeTag: {
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(13,206,143,0.10)", border: "1px solid rgba(13,206,143,0.22)",
        borderRadius: 20, padding: "4px 12px", fontSize: 11,
        color: "#0dce8f", fontWeight: 600, marginBottom: 10,
    },
    welcomeTitle: {
        fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800,
        color: "#e4f2ec", marginBottom: 6,
    },
    welcomeSub: { fontSize: 14, color: "#7da895" },
    welcomeRight: { flexShrink: 0 },
    findDoctorBtn: {
        background: "#0dce8f", border: "none", borderRadius: 12,
        padding: "12px 24px", fontSize: 14, fontWeight: 700,
        color: "#000", cursor: "pointer", fontFamily: "DM Sans,sans-serif",
        whiteSpace: "nowrap",
    },

    // Stats row
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 14, marginBottom: 28,
    },
    statCard: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "20px",
    },
    statIcon: { fontSize: 28, marginBottom: 10 },
    statNum: {
        fontFamily: "Syne,sans-serif", fontSize: 28,
        fontWeight: 800, color: "#0dce8f", marginBottom: 4,
    },
    statLabel: { fontSize: 12, color: "#7da895" },

    // Grid layout
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
    sectionLabel: {
        fontSize: 11, fontWeight: 700, letterSpacing: "1.8px",
        color: "#456659", textTransform: "uppercase", marginBottom: 14,
    },

    // Appointment card
    apptCard: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, overflow: "hidden",
    },
    apptHead: {
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    apptHeadTitle: { fontFamily: "Syne,sans-serif", fontSize: 15, fontWeight: 700, color: "#e4f2ec" },
    apptBody: { padding: 16, display: "flex", flexDirection: "column", gap: 10 },
    apptItem: {
        display: "flex", alignItems: "center", gap: 14,
        background: "#13201a", borderRadius: 12,
        padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)",
    },
    apptIconWrap: {
        width: 44, height: 44, background: "rgba(13,206,143,0.10)",
        border: "1px solid rgba(13,206,143,0.22)", borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
    },
    apptInfo: { flex: 1 },
    apptDoctor: { fontSize: 14, fontWeight: 600, color: "#e4f2ec", marginBottom: 3 },
    apptDetail: { fontSize: 12, color: "#7da895" },
    apptBadge: {
        fontSize: 10, fontWeight: 700, padding: "3px 10px",
        borderRadius: 6, flexShrink: 0,
    },
    emptyState: {
        padding: "32px 20px", textAlign: "center",
        color: "#456659", fontSize: 14,
    },

    // Quick actions
    actionsCard: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, overflow: "hidden",
    },
    actionsHead: {
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    actionsBody: { padding: 16, display: "flex", flexDirection: "column", gap: 10 },
    actionBtn: {
        display: "flex", alignItems: "center", gap: 14,
        background: "#13201a", borderRadius: 12,
        padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer", transition: "all 0.2s", width: "100%",
        textAlign: "left", fontFamily: "DM Sans,sans-serif",
    },
    actionIcon: {
        width: 40, height: 40, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
    },
    actionTitle: { fontSize: 14, fontWeight: 600, color: "#e4f2ec", marginBottom: 2 },
    actionSub: { fontSize: 12, color: "#7da895" },
    actionArrow: { marginLeft: "auto", color: "#0dce8f", opacity: 0.5 },

    // Health tips
    tipsCard: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, overflow: "hidden", marginTop: 20,
    },
    tipItem: {
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
    },
    tipIcon: { fontSize: 20, flexShrink: 0, marginTop: 1 },
    tipText: { fontSize: 13, color: "#7da895", lineHeight: 1.6 },
    tipTitle: { fontSize: 13, fontWeight: 600, color: "#e4f2ec", marginBottom: 3 },
}

// Mock upcoming appointments — replace with real API data later
const MOCK_APPOINTMENTS = [
    {
        id: 1, doctor: "Dr. Amit Sharma",
        specialization: "Cardiologist",
        date: "Tomorrow", time: "10:30 AM",
        clinic: "City Care Clinic, Pune",
        fee: 500, status: "CONFIRMED",
    },
    {
        id: 2, doctor: "Dr. Priya Patel",
        specialization: "Dermatologist",
        date: "25 May 2026", time: "2:00 PM",
        clinic: "Skin Care Centre, Pune",
        fee: 400, status: "CONFIRMED",
    },
]

const QUICK_ACTIONS = [
    { icon:"🔍", color:"rgba(13,206,143,0.12)", label:"Find a Doctor",      sub:"Search by specialization or city",   path:"/patient/find-doctor" },
    { icon:"🩺", color:"rgba(77,166,255,0.12)", label:"Symptom Checker",    sub:"AI guidance on which doctor to see", path:"/symptom" },
    { icon:"📋", color:"rgba(255,179,71,0.12)", label:"My Appointments",    sub:"View and manage your bookings",      path:"/patient/appointments" },
    { icon:"📄", color:"rgba(255,77,109,0.10)", label:"Report Analyzer",    sub:"Upload and understand your reports", path:"/report" },
]

const HEALTH_TIPS = [
    { icon:"💧", title:"Stay Hydrated",    text:"Drink at least 8 glasses of water daily to maintain good health." },
    { icon:"🥗", title:"Eat Balanced",     text:"Include fruits, vegetables, and proteins in every meal." },
    { icon:"🚶", title:"Stay Active",      text:"30 minutes of walking daily reduces risk of heart disease by 30%." },
]

export default function PatientDashboard() {
    const navigate    = useNavigate()
    const { user, logout } = useAuth()

    return (
        <div style={{ minHeight:"100vh", background:"#080f0c",
            color:"#e4f2ec", padding:"32px 40px" }}>
            <div style={S.page}>

                {/* Welcome bar */}
                <div style={S.welcomeBar}>
                    <div style={S.welcomeLine} />
                    <div style={S.welcomeLeft}>
                        <div style={S.welcomeTag}>
                            <span style={{ width:6, height:6, background:"#0dce8f", borderRadius:"50%" }} />
                            Patient Portal
                        </div>
                        <div style={S.welcomeTitle}>
                            Welcome back, {user?.name || "Patient"} 👋
                        </div>
                        <div style={S.welcomeSub}>
                            Your health dashboard — appointments, doctors, and AI tools all in one place.
                        </div>
                    </div>
                    <div style={S.welcomeRight}>
                        <button
                            style={S.findDoctorBtn}
                            onClick={() => navigate("/patient/find-doctor")}
                            onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                            onMouseLeave={e => e.currentTarget.style.opacity="1"}
                        >
                            + Book Appointment
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={S.statsRow}>
                    {[
                        { icon:"📅", num:"2",    label:"Upcoming appointments" },
                        { icon:"✅", num:"5",    label:"Completed visits" },
                        { icon:"👨‍⚕️", num:"3",  label:"Doctors consulted" },
                        { icon:"📋", num:"4",    label:"Reports uploaded" },
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

                    {/* Upcoming appointments */}
                    <div>
                        <div style={S.sectionLabel}>Upcoming appointments</div>
                        <div style={S.apptCard}>
                            <div style={S.apptHead}>
                                <div style={S.apptHeadTitle}>📅 Scheduled</div>
                                <span style={{ fontSize:12, color:"#0dce8f", cursor:"pointer" }}
                                      onClick={() => navigate("/patient/appointments")}>
                  View all →
                </span>
                            </div>
                            <div style={S.apptBody}>
                                {MOCK_APPOINTMENTS.length === 0 ? (
                                    <div style={S.emptyState}>
                                        No upcoming appointments.<br/>
                                        <span style={{ color:"#0dce8f", cursor:"pointer" }}
                                              onClick={() => navigate("/patient/find-doctor")}>
                      Book one now →
                    </span>
                                    </div>
                                ) : MOCK_APPOINTMENTS.map(a => (
                                    <div key={a.id} style={S.apptItem}>
                                        <div style={S.apptIconWrap}>👨‍⚕️</div>
                                        <div style={S.apptInfo}>
                                            <div style={S.apptDoctor}>{a.doctor}</div>
                                            <div style={S.apptDetail}>{a.specialization} · {a.date} · {a.time}</div>
                                            <div style={{ ...S.apptDetail, marginTop:2 }}>📍 {a.clinic}</div>
                                            <div style={{ ...S.apptDetail, marginTop:2 }}>💰 ₹{a.fee} at clinic</div>
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
                        <div style={S.actionsCard}>
                            <div style={S.actionsBody}>
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
                                        <svg style={S.actionArrow} width="16" height="16"
                                             fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health tips */}
                <div style={{ marginTop:28 }}>
                    <div style={S.sectionLabel}>Daily health tips</div>
                    <div style={S.tipsCard}>
                        {HEALTH_TIPS.map((tip, i) => (
                            <div key={i} style={{
                                ...S.tipItem,
                                borderBottom: i === HEALTH_TIPS.length-1
                                    ? "none" : "1px solid rgba(255,255,255,0.04)"
                            }}>
                                <div style={S.tipIcon}>{tip.icon}</div>
                                <div>
                                    <div style={S.tipTitle}>{tip.title}</div>
                                    <div style={S.tipText}>{tip.text}</div>
                                </div>
                            </div>
                        ))}
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