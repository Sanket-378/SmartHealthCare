
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"
const S = {
    page: { minHeight:"100vh", background:"#080f0c", color:"#e4f2ec", padding:"32px 40px" },
    inner: { maxWidth:1100 },

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
    welcomeTitle: { fontFamily:"Syne,sans-serif", fontSize:26,
        fontWeight:800, color:"#e4f2ec", marginBottom:6 },
    welcomeSub: { fontSize:14, color:"#7da895" },

    // Stats
    statsRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 },
    statCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:14, padding:20,
    },
    statIcon: { fontSize:28, marginBottom:10 },
    statNum: { fontFamily:"Syne,sans-serif", fontSize:28,
        fontWeight:800, color:"#0dce8f", marginBottom:4 },
    statLabel: { fontSize:12, color:"#7da895" },

    sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:"1.8px",
        color:"#456659", textTransform:"uppercase", marginBottom:14 },

    // Pending doctors card
    pendingCard: {
        background:"#0c1812", border:"1px solid rgba(255,179,71,0.2)",
        borderRadius:14, overflow:"hidden", marginBottom:24,
    },
    pendingHead: {
        padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(255,179,71,0.05)",
    },
    pendingHeadTitle: { fontFamily:"Syne,sans-serif", fontSize:15,
        fontWeight:700, color:"#ffb347" },
    pendingBadge: {
        background:"rgba(255,179,71,0.15)", color:"#ffb347",
        fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:10,
    },
    pendingBody: { padding:16, display:"flex", flexDirection:"column", gap:12 },

    // Doctor row
    doctorRow: {
        background:"#13201a", borderRadius:12,
        border:"1px solid rgba(255,255,255,0.05)",
        padding:"16px 18px",
    },
    doctorTop: { display:"flex", alignItems:"center", gap:14, marginBottom:12 },
    doctorIcon: {
        width:46, height:46, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:12,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22, flexShrink:0,
    },
    doctorInfo: { flex:1 },
    doctorName: { fontSize:15, fontWeight:700, color:"#e4f2ec", marginBottom:3 },
    doctorDetail: { fontSize:12, color:"#7da895" },
    doctorBtns: { display:"flex", gap:8 },
    approveBtn: {
        padding:"8px 16px", background:"rgba(13,206,143,0.15)",
        border:"1px solid rgba(13,206,143,0.3)", borderRadius:8,
        color:"#0dce8f", fontSize:12, fontWeight:700,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    rejectBtn: {
        padding:"8px 16px", background:"rgba(255,77,109,0.10)",
        border:"1px solid rgba(255,77,109,0.25)", borderRadius:8,
        color:"#ff4d6d", fontSize:12, fontWeight:700,
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    doctorMeta: {
        display:"grid", gridTemplateColumns:"repeat(4,1fr)",
        gap:8, paddingTop:12,
        borderTop:"1px solid rgba(255,255,255,0.05)",
    },
    metaItem: { fontSize:11, color:"#456659" },
    metaVal: { fontSize:12, fontWeight:600, color:"#7da895", marginTop:2 },

    // Grid
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
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
    listItem: {
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 14px", background:"#13201a", borderRadius:10,
        border:"1px solid rgba(255,255,255,0.05)",
    },
    listItemLeft: { display:"flex", alignItems:"center", gap:12 },
    listItemIcon: {
        width:36, height:36, borderRadius:9,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
    },
    listItemName: { fontSize:13, fontWeight:600, color:"#e4f2ec", marginBottom:2 },
    listItemSub: { fontSize:11, color:"#7da895" },

    emptyState: { padding:"28px 20px", textAlign:"center", color:"#456659", fontSize:14 },

    // Reject modal
    modal: {
        position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:1000, padding:20,
    },
    modalCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:16, padding:28, width:"100%", maxWidth:420,
    },
    modalTitle: { fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800,
        color:"#e4f2ec", marginBottom:8 },
    modalSub: { fontSize:13, color:"#7da895", marginBottom:18 },
    modalInput: {
        width:"100%", background:"#080f0c",
        border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14,
        color:"#e4f2ec", outline:"none", fontFamily:"DM Sans,sans-serif",
        marginBottom:16, resize:"vertical", minHeight:80,
    },
    modalBtns: { display:"flex", gap:10 },
    modalCancel: {
        flex:1, padding:11, background:"transparent",
        border:"1px solid rgba(255,255,255,0.15)",
        borderRadius:10, color:"#7da895", fontSize:13,
        fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
    modalConfirm: {
        flex:1, padding:11, background:"rgba(255,77,109,0.15)",
        border:"1px solid rgba(255,77,109,0.3)",
        borderRadius:10, color:"#ff4d6d", fontSize:13,
        fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
}

// Mock pending doctors — replace with real API later
const MOCK_PENDING = [
    {
        id:1, name:"Dr. Amit Sharma", specialization:"Cardiologist",
        qualification:"MBBS, MD", experience:"8 years",
        clinic:"City Care Clinic", city:"Pune", fee:500,
        email:"amit@example.com", submittedOn:"18 May 2026",
    },
    {
        id:2, name:"Dr. Priya Patel", specialization:"Dermatologist",
        qualification:"MBBS, DVD", experience:"5 years",
        clinic:"Skin Care Centre", city:"Mumbai", fee:400,
        email:"priya@example.com", submittedOn:"19 May 2026",
    },
    {
        id:3, name:"Dr. Rahul Mehta", specialization:"Neurologist",
        qualification:"MBBS, DM", experience:"12 years",
        clinic:"Brain & Spine Clinic", city:"Nashik", fee:800,
        email:"rahul@example.com", submittedOn:"20 May 2026",
    },
]

const MOCK_RECENT_USERS = [
    { icon:"🧑", color:"rgba(13,206,143,0.12)", name:"Sanket Patil",   sub:"Patient · Joined today",     badge:"NEW" },
    { icon:"🧑", color:"rgba(13,206,143,0.12)", name:"Neha Sharma",    sub:"Patient · Joined yesterday",  badge:"" },
    { icon:"👨‍⚕️", color:"rgba(77,166,255,0.12)", name:"Dr. Amit Sharma", sub:"Doctor · Pending approval", badge:"PENDING" },
]

export default function AdminDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [pendingDoctors, setPendingDoctors] = useState([])
    const [rejectModal, setRejectModal] = useState(null) // doctor id
    const [rejectReason, setRejectReason] = useState("")
    const [actionMsg, setActionMsg] = useState("")
    useEffect(() => {
        fetchPendingDoctors()
    }, [])

    const fetchPendingDoctors = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/admin/pending-doctors")
            const data = await res.json()
            setPendingDoctors(data)
        } catch (err) {
            console.error("Failed to fetch pending doctors:", err)
        }
    }

    const showMsg = (msg) => {
        setActionMsg(msg)
        setTimeout(() => setActionMsg(""), 3000)
    }

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/auth/admin/approve-doctor/${id}`, {
                method: "PUT",
            })
            if (res.ok) {
                setPendingDoctors(p => p.filter(d => d.id !== id))
                showMsg("✅ Doctor approved successfully. They can now log in.")
            }
        } catch (err) {
            showMsg("❌ Failed to approve doctor.")
        }
    }

    const handleReject = async () => {
        if (!rejectReason.trim()) return
        try {
            const res = await fetch(`http://localhost:8080/api/auth/admin/reject-doctor/${rejectModal}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectReason }),
            })
            if (res.ok) {
                setPendingDoctors(p => p.filter(d => d.id !== rejectModal))
                setRejectModal(null)
                setRejectReason("")
                showMsg("❌ Doctor rejected. They have been notified.")
            }
        } catch (err) {
            showMsg("❌ Failed to reject doctor.")
        }
    }

    return (
        <div style={S.page}>
            <div style={S.inner}>

                {/* Action message */}
                {actionMsg && (
                    <div style={{
                        background:"rgba(13,206,143,0.10)", border:"1px solid rgba(13,206,143,0.25)",
                        borderRadius:10, padding:"12px 18px", fontSize:13,
                        color:"#0dce8f", marginBottom:20,
                    }}>
                        {actionMsg}
                    </div>
                )}

                {/* Welcome bar */}
                <div style={S.welcomeBar}>
                    <div style={S.welcomeLine} />
                    <div>
                        <div style={S.welcomeTag}>
                            <span style={{ width:6, height:6, background:"#0dce8f", borderRadius:"50%" }} />
                            Admin Portal
                        </div>
                        <div style={S.welcomeTitle}>
                            Admin Dashboard 🛡️
                        </div>
                        <div style={S.welcomeSub}>
                            Manage doctors, patients, and platform activity.
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={S.statsRow}>
                    {[
                        { icon:"👨‍⚕️", num:"24",  label:"Total doctors" },
                        { icon:"🧑",   num:"186", label:"Total patients" },
                        { icon:"📅",   num:"12",  label:"Appointments today" },
                        { icon:"⏳",   num:pendingDoctors.length, label:"Pending verifications" },
                    ].map(({ icon, num, label }) => (
                        <div key={label} style={{
                            ...S.statCard,
                            borderColor: label === "Pending verifications" && num > 0
                                ? "rgba(255,179,71,0.3)" : "rgba(255,255,255,0.07)"
                        }}>
                            <div style={S.statIcon}>{icon}</div>
                            <div style={{
                                ...S.statNum,
                                color: label === "Pending verifications" && num > 0 ? "#ffb347" : "#0dce8f"
                            }}>{num}</div>
                            <div style={S.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Pending doctor verifications */}
                <div style={S.sectionLabel}>
                    ⏳ Pending doctor verifications
                    {pendingDoctors.length > 0 && (
                        <span style={{
                            marginLeft:10, background:"rgba(255,179,71,0.15)",
                            color:"#ffb347", fontSize:10, fontWeight:700,
                            padding:"2px 8px", borderRadius:10,
                        }}>
              {pendingDoctors.length} pending
            </span>
                    )}
                </div>

                {pendingDoctors.length === 0 ? (
                    <div style={{
                        ...S.pendingCard,
                        borderColor:"rgba(13,206,143,0.2)",
                    }}>
                        <div style={S.emptyState}>
                            ✅ All doctor applications have been reviewed. No pending verifications.
                        </div>
                    </div>
                ) : (
                    <div style={S.pendingCard}>
                        <div style={S.pendingHead}>
                            <div style={S.pendingHeadTitle}>⚠️ Doctors awaiting approval</div>
                            <span style={S.pendingBadge}>{pendingDoctors.length} pending</span>
                        </div>
                        <div style={S.pendingBody}>
                            {pendingDoctors.map(doc => (
                                <div key={doc.id} style={S.doctorRow}>
                                    <div style={S.doctorTop}>
                                        <div style={S.doctorIcon}>👨‍⚕️</div>
                                        <div style={S.doctorInfo}>
                                            <div style={S.doctorName}>{doc.name}</div>
                                            <div style={S.doctorDetail}>
                                                {doc.specialization} · {doc.qualification} · {doc.city}
                                            </div>
                                            <div style={{ ...S.doctorDetail, marginTop:2 }}>
                                                📧 {doc.email} · Submitted: {new Date(doc.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={S.doctorBtns}>
                                            <button
                                                style={S.approveBtn}
                                                onClick={() => handleApprove(doc.id)}
                                                onMouseEnter={e => e.currentTarget.style.background="rgba(13,206,143,0.25)"}
                                                onMouseLeave={e => e.currentTarget.style.background="rgba(13,206,143,0.15)"}
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                style={S.rejectBtn}
                                                onClick={() => setRejectModal(doc.id)}
                                                onMouseEnter={e => e.currentTarget.style.background="rgba(255,77,109,0.2)"}
                                                onMouseLeave={e => e.currentTarget.style.background="rgba(255,77,109,0.10)"}
                                            >
                                                ✕ Reject
                                            </button>
                                        </div>
                                    </div>
                                    <div style={S.doctorMeta}>
                                        {[
                                            { label:"Experience", val:doc.experience },
                                            { label:"Clinic",     val:doc.clinicName },
                                            { label:"Fee",        val:`₹${doc.fee}` },
                                            { label:"License",    val:"View document →" },
                                        ].map(({ label, val }) => (
                                            <div key={label} style={S.metaItem}>
                                                {label}
                                                <div style={{
                                                    ...S.metaVal,
                                                    color: val === "View document →" ? "#0dce8f" : "#7da895",
                                                    cursor: val === "View document →" ? "pointer" : "default",
                                                }}>
                                                    {val}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom grid */}
                <div style={S.grid2}>

                    {/* Recent users */}
                    <div>
                        <div style={S.sectionLabel}>Recent registrations</div>
                        <div style={S.card}>
                            <div style={S.cardHead}>
                                <div style={S.cardHeadTitle}>👥 New users</div>
                                <span style={{ fontSize:12, color:"#0dce8f", cursor:"pointer" }}>
                  View all →
                </span>
                            </div>
                            <div style={S.cardBody}>
                                {MOCK_RECENT_USERS.map((u, i) => (
                                    <div key={i} style={S.listItem}>
                                        <div style={S.listItemLeft}>
                                            <div style={{ ...S.listItemIcon, background:u.color }}>
                                                {u.icon}
                                            </div>
                                            <div>
                                                <div style={S.listItemName}>{u.name}</div>
                                                <div style={S.listItemSub}>{u.sub}</div>
                                            </div>
                                        </div>
                                        {u.badge && (
                                            <span style={{
                                                fontSize:9, fontWeight:700, padding:"2px 8px",
                                                borderRadius:6,
                                                background: u.badge === "NEW"
                                                    ? "rgba(13,206,143,0.12)" : "rgba(255,179,71,0.12)",
                                                color: u.badge === "NEW" ? "#0dce8f" : "#ffb347",
                                            }}>
                        {u.badge}
                      </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Platform stats */}
                    <div>
                        <div style={S.sectionLabel}>Platform overview</div>
                        <div style={S.card}>
                            <div style={S.cardHead}>
                                <div style={S.cardHeadTitle}>📊 Stats</div>
                            </div>
                            <div style={S.cardBody}>
                                {[
                                    { label:"Appointments this week", val:"47",  color:"#0dce8f" },
                                    { label:"Active doctors",          val:"21",  color:"#0dce8f" },
                                    { label:"New patients this month", val:"34",  color:"#4da6ff" },
                                    { label:"Rejected applications",   val:"3",   color:"#ff4d6d" },
                                    { label:"Most popular specialty",  val:"General Physician", color:"#ffb347" },
                                ].map(({ label, val, color }) => (
                                    <div key={label} style={S.listItem}>
                                        <span style={{ fontSize:13, color:"#7da895" }}>{label}</span>
                                        <span style={{ fontSize:13, fontWeight:700, color }}>{val}</span>
                                    </div>
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

            {/* Reject modal */}
            {rejectModal && (
                <div style={S.modal} onClick={() => setRejectModal(null)}>
                    <div style={S.modalCard} onClick={e => e.stopPropagation()}>
                        <div style={S.modalTitle}>Reject Doctor Application</div>
                        <div style={S.modalSub}>
                            Please provide a reason. The doctor will be notified by email.
                        </div>
                        <textarea
                            style={S.modalInput}
                            placeholder="e.g. License document is not clear. Please resubmit with a clearer image."
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                        />
                        <div style={S.modalBtns}>
                            <button style={S.modalCancel} onClick={() => setRejectModal(null)}>
                                Cancel
                            </button>
                            <button style={S.modalConfirm} onClick={handleReject}>
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}