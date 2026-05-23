import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SPECIALIZATIONS = [
    "All", "General Physician", "Cardiologist", "Dermatologist",
    "Neurologist", "Orthopaedician", "Gynaecologist",
    "Paediatrician", "Psychiatrist", "Ophthalmologist",
    "ENT Specialist", "Gastroenterologist",
]

const S = {
    page: { maxWidth:1100 },
    title: { fontFamily:"Syne,sans-serif", fontSize:38, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc: { fontSize:15, color:"#7da895", marginBottom:28, maxWidth:520, lineHeight:1.7 },
    searchBar: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:14, padding:"20px 24px", marginBottom:24,
    },
    searchRow: { display:"flex", gap:12, marginBottom:16 },
    searchInput: {
        flex:1, background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 16px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", transition:"border-color 0.2s",
    },
    searchBtn: {
        padding:"12px 24px", background:"#0dce8f", border:"none",
        borderRadius:10, fontSize:14, fontWeight:700, color:"#000",
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", whiteSpace:"nowrap",
    },
    filterRow: { display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" },
    filterLabel: { fontSize:12, color:"#456659", marginRight:4 },
    filterSelect: {
        background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:8, padding:"8px 12px", fontSize:13, color:"#e4f2ec",
        outline:"none", cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    },
    resultsHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
    resultsCount: { fontSize:13, color:"#7da895" },
    sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:"1.8px", color:"#456659", textTransform:"uppercase" },
    doctorGrid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 },
    doctorCard: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"20px", cursor:"pointer",
        transition:"all 0.2s", position:"relative", overflow:"hidden",
    },
    cardTop: { display:"flex", gap:14, marginBottom:16 },
    docAvatar: {
        width:56, height:56, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:14,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:26, flexShrink:0,
    },
    docInfo: { flex:1 },
    docName: { fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e4f2ec", marginBottom:3 },
    docSpec: { fontSize:13, color:"#0dce8f", fontWeight:500, marginBottom:3 },
    docQual: { fontSize:12, color:"#7da895" },
    ratingRow: { display:"flex", alignItems:"center", gap:6, marginTop:4 },
    ratingNum: { fontSize:13, fontWeight:700, color:"#ffb347" },
    ratingCount: { fontSize:11, color:"#456659" },
    cardMeta: {
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8,
        padding:"12px 0", borderTop:"1px solid rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.05)", marginBottom:14,
    },
    metaItem: { fontSize:11, color:"#456659" },
    metaVal: { fontSize:12, fontWeight:600, color:"#7da895", marginTop:2 },
    cardBottom: { display:"flex", alignItems:"center", justifyContent:"space-between" },
    nextSlot: { fontSize:12, color:"#7da895" },
    nextSlotVal: { fontSize:12, fontWeight:600, color:"#0dce8f" },
    bookBtn: {
        padding:"9px 20px", background:"#0dce8f", border:"none",
        borderRadius:9, fontSize:13, fontWeight:700, color:"#000",
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    availableDot: { position:"absolute", top:16, right:16, width:8, height:8, borderRadius:"50%" },
    noResults: {
        gridColumn:"1/-1", padding:"48px 24px", textAlign:"center",
        color:"#456659", fontSize:14, lineHeight:1.8,
    },
}

function StarRating({ rating }) {
    return (
        <div style={{ display:"flex", gap:2 }}>
            {[1,2,3,4,5].map(i => (
                <span key={i} style={{ fontSize:12, color: i <= Math.floor(rating) ? "#ffb347" : "rgba(255,179,71,0.25)" }}>★</span>
            ))}
        </div>
    )
}

export default function FindDoctor() {
    const navigate = useNavigate()
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch]   = useState("")
    const [city, setCity]       = useState("All")
    const [spec, setSpec]       = useState("All")
    const [maxFee, setMaxFee]   = useState("All")

    useEffect(() => { fetchDoctors() }, [])

    const fetchDoctors = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/doctors")
            const data = await res.json()
            setDoctors(data)
        } catch (err) {
            console.error("Failed to fetch doctors:", err)
        } finally {
            setLoading(false)
        }
    }

    const cities = ["All", ...new Set(doctors.map(d => d.city).filter(Boolean))]

    const filtered = doctors.filter(d => {
        const matchSearch =
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
            d.clinicName?.toLowerCase().includes(search.toLowerCase())
        const matchCity = city === "All" || d.city === city
        const matchSpec = spec === "All" || d.specialization === spec
        const matchFee  = maxFee === "All" || d.fee <= parseInt(maxFee)
        return matchSearch && matchCity && matchSpec && matchFee
    })

    if (loading) {
        return (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
                <div style={{ textAlign:"center", color:"#7da895" }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🔄</div>
                    <div>Loading doctors...</div>
                </div>
            </div>
        )
    }

    return (
        <div style={S.page}>
            <h1 style={S.title}>Find a <span style={S.green}>Doctor</span></h1>
            <p style={S.desc}>
                Search verified doctors by specialization, city, or name.
                Book an appointment in seconds.
            </p>

            {/* Search + filters */}
            <div style={S.searchBar}>
                <div style={S.searchRow}>
                    <input
                        style={S.searchInput}
                        placeholder="Search by doctor name, specialization, or clinic..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={e => e.target.style.borderColor="#0dce8f"}
                        onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.10)"}
                    />
                    <button style={S.searchBtn}>🔍 Search</button>
                </div>
                <div style={S.filterRow}>
                    <span style={S.filterLabel}>Filter by:</span>
                    <select style={S.filterSelect} value={city} onChange={e => setCity(e.target.value)}>
                        {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
                    </select>
                    <select style={S.filterSelect} value={spec} onChange={e => setSpec(e.target.value)}>
                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s === "All" ? "All Specializations" : s}</option>)}
                    </select>
                    <select style={S.filterSelect} value={maxFee} onChange={e => setMaxFee(e.target.value)}>
                        <option value="All">Any Fee</option>
                        <option value="200">Under ₹200</option>
                        <option value="400">Under ₹400</option>
                        <option value="600">Under ₹600</option>
                        <option value="1000">Under ₹1000</option>
                    </select>
                    {(search || city !== "All" || spec !== "All" || maxFee !== "All") && (
                        <button
                            onClick={() => { setSearch(""); setCity("All"); setSpec("All"); setMaxFee("All") }}
                            style={{
                                padding:"6px 14px", borderRadius:20, fontSize:12,
                                background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.25)",
                                color:"#ff4d6d", cursor:"pointer", fontFamily:"DM Sans,sans-serif",
                            }}
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div style={S.resultsHeader}>
                <div style={S.sectionLabel}>Verified doctors</div>
                <div style={S.resultsCount}>{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</div>
            </div>

            <div style={S.doctorGrid}>
                {filtered.length === 0 ? (
                    <div style={S.noResults}>
                        {doctors.length === 0
                            ? "No verified doctors yet. Doctors need to register and get approved."
                            : "No doctors match your search."}
                    </div>
                ) : filtered.map(doc => (
                    <div
                        key={doc.id}
                        style={S.doctorCard}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(13,206,143,0.3)"; e.currentTarget.style.background="#13201a" }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="#0c1812" }}
                    >
                        <div style={{ ...S.availableDot, background:"#0dce8f", boxShadow:"0 0 6px rgba(13,206,143,0.5)" }} />
                        <div style={S.cardTop}>
                            <div style={S.docAvatar}>👨‍⚕️</div>
                            <div style={S.docInfo}>
                                <div style={S.docName}>{doc.name}</div>
                                <div style={S.docSpec}>{doc.specialization}</div>
                                <div style={S.docQual}>{doc.qualification} · {doc.experience} yrs exp.</div>
                                <div style={S.ratingRow}>
                                    <StarRating rating={doc.rating || 0} />
                                    <span style={S.ratingNum}>{doc.rating || "New"}</span>
                                    <span style={S.ratingCount}>({doc.totalReviews || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div style={S.cardMeta}>
                            {[
                                { label:"Clinic", val:doc.clinicName },
                                { label:"City",   val:doc.city },
                                { label:"Fee",    val:`₹${doc.fee}` },
                            ].map(({ label, val }) => (
                                <div key={label} style={S.metaItem}>
                                    {label}
                                    <div style={{ ...S.metaVal, color: label === "Fee" ? "#0dce8f" : "#7da895" }}>{val}</div>
                                </div>
                            ))}
                        </div>
                        <div style={S.cardBottom}>
                            <div>
                                <div style={S.nextSlot}>Verified Doctor</div>
                                <div style={S.nextSlotVal}>{doc.city}</div>
                            </div>
                            <button
                                style={S.bookBtn}
                                onClick={() => navigate(`/patient/book/${doc.id}`)}
                                onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                                onMouseLeave={e => e.currentTarget.style.opacity="1"}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}