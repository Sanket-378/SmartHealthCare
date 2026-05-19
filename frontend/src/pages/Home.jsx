import { useNavigate } from "react-router-dom"

const FEATURES = [
{ to: "/chatbot",  icon: "🩺", title: "AI Chatbot",  sub: "Describe symptoms → get specialist guidance", badge: "AI" },    { to: "/nearcare", icon: "📍", title: "NearCare Locator",     sub: "Find PHC, blood bank, ambulance near you" },
    { to: "/report",   icon: "📋", title: "Report Analyzer",      sub: "Upload any report → plain language explanation", badge: "AI" },
    { to: "/medicine", icon: "💊", title: "Medicine Safety",      sub: "Verify medicine + vaccination schedule" },
]

const STATS = [
    { num: "1.4B",  label: "Indians who need accessible healthcare" },
    { num: "65%",   label: "Rural population with limited clinic access" },
    { num: "₹0",    label: "Cost to use HealthSetu — always free" },
    { num: "3 min", label: "Average time to get AI guidance" },
]

const HERO_STATS = [
    { num: "6 Lakh+", label: "Villages covered" },
    { num: "3 Lang",  label: "Multilingual AI" },
    { num: "Free",    label: "Always free" },
    { num: "24/7",    label: "AI available" },
]

const S = {
    page: { position:"relative", zIndex:10 },

    /* hero */
    hero: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", marginBottom:48 },

    /* tag */
    tag: { display:"inline-flex", alignItems:"center", gap:8, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:20, padding:"5px 14px",
        fontSize:12, color:"#0dce8f", fontWeight:600, letterSpacing:0.5, marginBottom:18 },
    tagDot: { width:6, height:6, background:"#0dce8f", borderRadius:"50%" },

    /* title */
    title: { fontFamily:"Syne,sans-serif", fontSize:44, fontWeight:800, letterSpacing:-1,
        lineHeight:1.1, marginBottom:14 },
    titleSpan: { color:"#0dce8f" },

    /* desc */
    desc: { fontSize:15, color:"#7da895", lineHeight:1.7, marginBottom:28, maxWidth:480 },

    /* hero stats grid */
    heroGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
    heroStat: { background:"#101d16", border:"1px solid rgba(255,255,255,0.05)",
        borderRadius:12, padding:"16px 18px" },
    heroStatNum: { fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#0dce8f" },
    heroStatLabel: { fontSize:12, color:"#7da895", marginTop:3 },

    /* feature links */
    featList: { display:"flex", flexDirection:"column", gap:12 },
    featLink: { display:"flex", alignItems:"center", gap:16,
        background:"#13201a", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, padding:"18px 20px", cursor:"pointer",
        transition:"all 0.2s", textAlign:"left", width:"100%" },
    featIcon: { width:48, height:48, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:14,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22, flexShrink:0 },
    featInfo: { flex:1, minWidth:0 },
    featTitle: { fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700,
        color:"#e4f2ec", display:"flex", alignItems:"center", gap:8 },
    featSub: { fontSize:12, color:"#7da895", marginTop:3 },
    featBadge: { fontSize:9, fontWeight:700, background:"#0dce8f",
        color:"#000", padding:"2px 7px", borderRadius:10 },
    featArrow: { color:"#0dce8f", opacity:0.5, flexShrink:0 },

    /* section label */
    sectionLabel: { fontSize:11, fontWeight:600, letterSpacing:"1.8px",
        color:"#456659", textTransform:"uppercase", marginBottom:16 },

    /* impact grid */
    impactGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 },
    impactCard: { background:"#13201a", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, padding:"24px 16px", textAlign:"center" },
    impactNum: { fontFamily:"Syne,sans-serif", fontSize:32, fontWeight:800,
        color:"#0dce8f", marginBottom:8 },
    impactLabel: { fontSize:13, color:"#7da895", lineHeight:1.4 },

    /* banner */
    banner: { marginTop:24, background:"#13201a",
        border:"1px solid rgba(13,206,143,0.15)", borderRadius:16,
        padding:"22px 28px", display:"flex",
        alignItems:"center", justifyContent:"space-between", gap:20 },
    bannerTitle: { fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:700,
        color:"#e4f2ec", marginBottom:6 },
    bannerSub: { fontSize:14, color:"#7da895" },
    bannerBtn: { flexShrink:0, background:"#0dce8f", color:"#000",
        fontWeight:700, padding:"12px 24px", borderRadius:12,
        fontSize:14, border:"none", cursor:"pointer", whiteSpace:"nowrap" },
}

export default function Home() {
    const navigate = useNavigate()

    return (
        <div style={S.page}>

            {/* Ambient background blobs */}
            <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
                <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
                    background:"#0dce8f", opacity:0.05, filter:"blur(130px)", top:-200, left:-200 }} />
                <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
                    background:"#00cfff", opacity:0.04, filter:"blur(120px)", bottom:0, right:-100 }} />
            </div>

            <div style={{ position:"relative", zIndex:1 }}>

                {/* ── HERO ── */}
                <div style={S.hero}>

                    {/* Left side */}
                    <div>
                        <div style={S.tag}>
                            <span style={S.tagDot} />
                            AI-Powered Healthcare
                        </div>

                        <h1 style={S.title}>
                            Healthcare for<br />
                            <span style={S.titleSpan}>Every Indian</span>
                        </h1>

                        <p style={S.desc}>
                            Symptom guidance, nearby clinics, and medical report analysis —
                            in your language, completely free. Built for India's 600,000 villages.
                        </p>

                        <div style={S.heroGrid}>
                            {HERO_STATS.map(({ num, label }) => (
                                <div key={num} style={S.heroStat}>
                                    <div style={S.heroStatNum}>{num}</div>
                                    <div style={S.heroStatLabel}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side — feature links */}
                    <div style={S.featList}>
                        {FEATURES.map(({ to, icon, title, sub, badge }) => (
                            <button
                                key={to}
                                onClick={() => navigate(to)}
                                style={S.featLink}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = "rgba(13,206,143,0.4)"
                                    e.currentTarget.style.background = "#192820"
                                    e.currentTarget.style.transform = "translateX(4px)"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                                    e.currentTarget.style.background = "#13201a"
                                    e.currentTarget.style.transform = "translateX(0)"
                                }}
                            >
                                <div style={S.featIcon}>{icon}</div>
                                <div style={S.featInfo}>
                                    <div style={S.featTitle}>
                                        {title}
                                        {badge && <span style={S.featBadge}>{badge}</span>}
                                    </div>
                                    <div style={S.featSub}>{sub}</div>
                                </div>
                                <svg style={S.featArrow} width="18" height="18" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── IMPACT STATS ── */}
                <div style={{ marginBottom:8 }}>
                    <div style={S.sectionLabel}>Impact in numbers</div>
                    <div style={S.impactGrid}>
                        {STATS.map(({ num, label }) => (
                            <div key={num} style={S.impactCard}>
                                <div style={S.impactNum}>{num}</div>
                                <div style={S.impactLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BANNER ── */}
                <div style={S.banner}>
                    <div>
                        <div style={S.bannerTitle}>Built for Bharat 🇮🇳</div>
                        <div style={S.bannerSub}>
                            Works in English, हिंदी, and मराठी. Accessible on any device, even slow internet.
                        </div>
                    </div>
                    <button
                        style={S.bannerBtn}
                        onClick={() => navigate("/chatbot")}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        Try Symptom Checker →
                    </button>
                </div>

            </div>
        </div>
    )
}