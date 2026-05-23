import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

const S = {
    page: { minHeight:"100vh", background:"#080f0c", color:"#e4f2ec", padding:"32px 40px" },
    inner: { maxWidth:1100 },
    title: { fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green: { color:"#0dce8f" },
    desc: { fontSize:15, color:"#7da895", marginBottom:32, lineHeight:1.7 },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, alignItems:"start" },
    card: {
        background:"#0c1812", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, padding:"24px", position:"relative", overflow:"hidden",
    },
    cardLine: {
        position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    sectionLabel: { fontSize:11, fontWeight:700, letterSpacing:"1.8px",
        color:"#456659", textTransform:"uppercase", marginBottom:14 },
    label: { fontSize:12, fontWeight:600, color:"#7da895", letterSpacing:"0.5px",
        marginBottom:6, display:"block" },
    input: {
        width:"100%", background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", transition:"border-color 0.2s",
        marginBottom:14, colorScheme:"dark",
    },
    select: {
        width:"100%", background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", marginBottom:14, cursor:"pointer",
    },
    addBtn: {
        width:"100%", padding:13, background:"#0dce8f", border:"none",
        borderRadius:10, fontSize:15, fontWeight:700, color:"#000",
        cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
    },
    success: {
        background:"rgba(13,206,143,0.10)", border:"1px solid rgba(13,206,143,0.25)",
        borderRadius:8, padding:"10px 14px", fontSize:13, color:"#0dce8f", marginBottom:14,
    },
    error: {
        background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.25)",
        borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ff4d6d", marginBottom:14,
    },
    slotList: { display:"flex", flexDirection:"column", gap:10 },
    slotCard: {
        background:"#13201a", border:"1px solid rgba(255,255,255,0.05)",
        borderRadius:12, padding:"14px 16px", display:"flex",
        alignItems:"center", gap:14,
    },
    slotIcon: {
        width:40, height:40, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:10,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:18, flexShrink:0,
    },
    slotInfo: { flex:1 },
    slotTime: { fontSize:14, fontWeight:600, color:"#e4f2ec", marginBottom:3 },
    slotDate: { fontSize:12, color:"#7da895" },
    slotBadge: { fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6 },
    deleteBtn: {
        background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.2)",
        borderRadius:8, padding:"6px 14px", color:"#ff4d6d", fontSize:12,
        fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif",
        transition:"all 0.2s", flexShrink:0,
    },
    emptyState: { padding:"32px 20px", textAlign:"center", color:"#456659", fontSize:14 },
    previewGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 },
    previewSlot: {
        background:"rgba(13,206,143,0.08)", border:"1px solid rgba(13,206,143,0.2)",
        borderRadius:8, padding:"8px", textAlign:"center", fontSize:12,
        color:"#0dce8f", fontWeight:500,
    },
}

const focus = e => e.target.style.borderColor = "#0dce8f"
const blur  = e => e.target.style.borderColor = "rgba(255,255,255,0.10)"

function generatePreview(start, end, duration) {
    if (!start || !end || !duration) return []
    const slots = []
    let [sh, sm] = start.split(":").map(Number)
    let [eh, em] = end.split(":").map(Number)
    let startMins = sh * 60 + sm
    let endMins   = eh * 60 + em
    let dur = parseInt(duration)
    while (startMins + dur <= endMins) {
        const h = Math.floor(startMins / 60)
        const m = startMins % 60
        const h2 = Math.floor((startMins + dur) / 60)
        const m2 = (startMins + dur) % 60
        slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} - ${String(h2).padStart(2,"0")}:${String(m2).padStart(2,"0")}`)
        startMins += dur
    }
    return slots
}

export default function ManageSlots() {
    const { user } = useAuth()
    const [slots, setSlots]       = useState([])
    const [loading, setLoading]   = useState(false)
    const [success, setSuccess]   = useState("")
    const [error, setError]       = useState("")
    const [form, setForm] = useState({
        date: "", startTime: "", endTime: "", duration: "30"
    })

    const preview = generatePreview(form.startTime, form.endTime, form.duration)

    useEffect(() => {
        if (user?.id) fetchSlots()
    }, [user])

    const fetchSlots = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/slots/doctor/${user.id}`)
            const data = await res.json()
            setSlots(data)
        } catch (err) {
            console.error("Failed to fetch slots:", err)
        }
    }

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

    const handleAddSlots = async (e) => {
        e.preventDefault()
        setError(""); setSuccess("")
        if (!form.date || !form.startTime || !form.endTime) {
            setError("Please fill in all fields."); return
        }
        if (preview.length === 0) {
            setError("No slots can be generated. Check your times."); return
        }
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8080/api/slots/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: user.id,
                    date: form.date,
                    startTime: form.startTime,
                    endTime: form.endTime,
                    duration: form.duration,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to add slots")
            setSuccess(`✅ ${data.count} slots added successfully!`)
            setForm({ date:"", startTime:"", endTime:"", duration:"30" })
            fetchSlots()
        } catch (err) {
            setError(err.message || "Failed to add slots.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (slotId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/slots/${slotId}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setSlots(p => p.filter(s => s.id !== slotId))
            setSuccess("Slot deleted successfully.")
        } catch (err) {
            setError(err.message || "Failed to delete slot.")
        }
    }

    const groupByDate = (slots) => {
        const groups = {}
        slots.forEach(slot => {
            if (!groups[slot.date]) groups[slot.date] = []
            groups[slot.date].push(slot)
        })
        return groups
    }

    const grouped = groupByDate(slots)

    return (
        <div style={S.page}>
            <div style={S.inner}>
                <h1 style={S.title}>Manage <span style={S.green}>Slots</span></h1>
                <p style={S.desc}>
                    Add available time slots for patients to book appointments.
                    Set your date, start time, end time and slot duration.
                </p>

                <div style={S.grid2}>

                    {/* Add slots form */}
                    <div>
                        <div style={S.card}>
                            <div style={S.cardLine} />
                            <div style={S.sectionLabel}>Add new slots</div>

                            {error   && <div style={S.error}>{error}</div>}
                            {success && <div style={S.success}>{success}</div>}

                            <form onSubmit={handleAddSlots}>
                                <label style={S.label}>Select date</label>
                                <input style={S.input} type="date"
                                       value={form.date} onChange={set("date")}
                                       min={new Date().toISOString().split("T")[0]}
                                       onFocus={focus} onBlur={blur}/>

                                <label style={S.label}>Start time</label>
                                <input style={S.input} type="time"
                                       value={form.startTime} onChange={set("startTime")}
                                       onFocus={focus} onBlur={blur}/>

                                <label style={S.label}>End time</label>
                                <input style={S.input} type="time"
                                       value={form.endTime} onChange={set("endTime")}
                                       onFocus={focus} onBlur={blur}/>

                                <label style={S.label}>Slot duration</label>
                                <select style={S.select} value={form.duration} onChange={set("duration")}>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>

                                {/* Preview */}
                                {preview.length > 0 && (
                                    <div style={{ marginBottom:14 }}>
                                        <div style={{ ...S.sectionLabel, marginBottom:10 }}>
                                            Preview — {preview.length} slots will be created
                                        </div>
                                        <div style={S.previewGrid}>
                                            {preview.map((slot, i) => (
                                                <div key={i} style={S.previewSlot}>{slot}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button type="submit" style={S.addBtn} disabled={loading}
                                        onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                                        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                                    {loading ? "Adding slots..." : `+ Add ${preview.length || ""} Slots`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Existing slots */}
                    <div>
                        <div style={S.sectionLabel}>
                            Your slots — {slots.length} total
                        </div>
                        {slots.length === 0 ? (
                            <div style={{ ...S.card, textAlign:"center" }}>
                                <div style={S.emptyState}>
                                    📅<br/><br/>No slots added yet.<br/>Add your first slot using the form.
                                </div>
                            </div>
                        ) : (
                            Object.entries(grouped).map(([date, dateSlots]) => (
                                <div key={date} style={{ marginBottom:16 }}>
                                    <div style={{
                                        fontSize:12, fontWeight:600, color:"#0dce8f",
                                        marginBottom:8, padding:"4px 0",
                                        borderBottom:"1px solid rgba(13,206,143,0.15)",
                                    }}>
                                        📅 {new Date(date).toLocaleDateString("en-IN", {
                                        weekday:"long", day:"numeric", month:"long", year:"numeric"
                                    })}
                                    </div>
                                    <div style={S.slotList}>
                                        {dateSlots.map(slot => (
                                            <div key={slot.id} style={S.slotCard}>
                                                <div style={S.slotIcon}>🕐</div>
                                                <div style={S.slotInfo}>
                                                    <div style={S.slotTime}>
                                                        {slot.startTime} — {slot.endTime}
                                                    </div>
                                                    <div style={S.slotDate}>{date}</div>
                                                </div>
                                                <div style={{
                                                    ...S.slotBadge,
                                                    background: slot.isBooked
                                                        ? "rgba(255,179,71,0.12)" : "rgba(13,206,143,0.12)",
                                                    color: slot.isBooked ? "#ffb347" : "#0dce8f",
                                                }}>
                                                    {slot.isBooked ? "Booked" : "Available"}
                                                </div>
                                                {!slot.isBooked && (
                                                    <button
                                                        style={S.deleteBtn}
                                                        onClick={() => handleDelete(slot.id)}
                                                        onMouseEnter={e => e.currentTarget.style.background="rgba(255,77,109,0.2)"}
                                                        onMouseLeave={e => e.currentTarget.style.background="rgba(255,77,109,0.10)"}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}