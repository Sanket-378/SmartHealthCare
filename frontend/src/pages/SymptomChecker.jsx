import { useState, useRef, useEffect } from "react"

const QUICK = [
    { label: "🌡️ Fever + Cough + Headache", value: "Fever, cough, headache, body ache" },
    { label: "🤢 Stomach pain + Nausea",     value: "Stomach pain, nausea, vomiting" },
    { label: "💔 Chest pain + Breathless",   value: "Chest pain, shortness of breath" },
    { label: "🔴 Skin rash + Itching",       value: "Skin rash, itching, swelling" },
    { label: "🦴 Joint pain + Stiffness",    value: "Joint pain, swelling, stiffness" },
]

const REPLIES = {
    fever:   "Fever + cough + headache suggests a possible viral infection or flu.\n\n🟡 Severity: Moderate\n👨‍⚕️ See: General Physician\n💧 Stay hydrated and rest\n⚠️ If fever exceeds 103°F, visit immediately.",
    stomach: "Stomach pain + nausea may indicate gastritis or food poisoning.\n\n🟡 Severity: Moderate\n👨‍⚕️ See: Gastroenterologist\n🥗 Eat light meals, avoid spicy food.",
    chest:   "Chest pain + breathlessness can be serious. Do not ignore.\n\n🔴 Severity: High — act immediately\n👨‍⚕️ See: Cardiologist or Emergency\n📞 Call 108 if pain is severe.",
    rash:    "Skin rash + itching may indicate an allergic reaction or infection.\n\n🟡 Severity: Moderate\n👨‍⚕️ See: Dermatologist\n🚫 Avoid scratching the affected area.",
    joint:   "Joint pain + stiffness could indicate arthritis or a joint infection.\n\n🟡 Severity: Moderate\n👨‍⚕️ See: Orthopaedician\n🛌 Rest the joint. Avoid heavy activity.",
    default: "Based on your symptoms, a General Physician consultation is recommended.\n\n⚠️ This is AI guidance only — not a diagnosis. Please consult a qualified doctor.",
}

function getReply(text) {
    const t = text.toLowerCase()
    if (t.includes("fever") || t.includes("cough") || t.includes("bukhar")) return REPLIES.fever
    if (t.includes("stomach") || t.includes("nausea") || t.includes("pet"))  return REPLIES.stomach
    if (t.includes("chest") || t.includes("breath"))                          return REPLIES.chest
    if (t.includes("rash") || t.includes("itch") || t.includes("skin"))      return REPLIES.rash
    if (t.includes("joint") || t.includes("knee") || t.includes("sандhe"))   return REPLIES.joint
    return REPLIES.default
}

const S = {
    wrap:    { maxWidth: 1100 },
    title:   { fontFamily:"Syne,sans-serif", fontSize:38, fontWeight:800, letterSpacing:-0.8, marginBottom:8 },
    green:   { color:"#0dce8f" },
    desc:    { fontSize:15, color:"#7da895", marginBottom:32, maxWidth:520, lineHeight:1.7 },
    layout:  { display:"grid", gridTemplateColumns:"1fr 320px", gap:28, alignItems:"start" },

    /* chat box */
    chatBox: { background:"#13201a", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column" },
    chatHead: { padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)",
        display:"flex", alignItems:"center", gap:12, flexShrink:0 },
    chatAv:  { width:40, height:40, background:"rgba(13,206,143,0.10)",
        border:"1px solid rgba(13,206,143,0.22)", borderRadius:12,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 },
    chatName:   { fontSize:14, fontWeight:600, color:"#e4f2ec" },
    chatStatus: { fontSize:12, color:"#0dce8f", display:"flex", alignItems:"center", gap:5, marginTop:2 },
    statusDot:  { width:6, height:6, background:"#0dce8f", borderRadius:"50%" },
    msgs:    { padding:20, display:"flex", flexDirection:"column", gap:12,
        overflowY:"auto", height:420 },
    msgBot:  { alignSelf:"flex-start", maxWidth:"80%" },
    msgUser: { alignSelf:"flex-end",   maxWidth:"80%" },
    bubbleBot:  { padding:"12px 16px", borderRadius:"4px 16px 16px 16px",
        background:"#192820", border:"1px solid rgba(255,255,255,0.07)",
        fontSize:14, lineHeight:1.65, color:"#e4f2ec" },
    bubbleUser: { padding:"12px 16px", borderRadius:"16px 16px 4px 16px",
        background:"#0dce8f", fontSize:14, lineHeight:1.65,
        color:"#000", fontWeight:500 },
    msgTime: { fontSize:10, color:"#456659", marginTop:4, paddingLeft:4 },
    msgTimeR:{ fontSize:10, color:"#456659", marginTop:4, textAlign:"right" },
    typingWrap: { alignSelf:"flex-start", display:"flex", gap:5, padding:"13px 16px",
        background:"#192820", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:"4px 16px 16px 16px" },
    typingDot: { width:7, height:7, background:"#456659", borderRadius:"50%" },
    inputRow: { padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.05)",
        display:"flex", gap:10, flexShrink:0 },
    input:   { flex:1, background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:12, padding:"12px 16px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif" },
    sendBtn: { width:44, height:44, background:"#0dce8f", border:"none",
        borderRadius:12, cursor:"pointer", display:"flex",
        alignItems:"center", justifyContent:"center", flexShrink:0 },

    /* sidebar */
    disclaimer: { background:"rgba(255,179,71,0.07)", border:"1px solid rgba(255,179,71,0.2)",
        borderRadius:10, padding:"14px 16px", fontSize:13, color:"#ffb347",
        lineHeight:1.65, marginBottom:18 },
    qlabel: { fontSize:10, fontWeight:600, letterSpacing:"1.8px", color:"#456659",
        textTransform:"uppercase", marginBottom:10 },
    qchip:  { display:"block", width:"100%", padding:"12px 16px", textAlign:"left",
        background:"#13201a", border:"1px solid rgba(255,255,255,0.08)",
        fontSize:13, color:"#7da895", cursor:"pointer",
        transition:"all 0.2s", borderBottom:"none", fontFamily:"DM Sans,sans-serif" },
}

export default function SymptomChecker() {
    const [messages, setMessages] = useState([
        { role:"bot", text:"Hello! I am HealthSetu AI. Please describe your symptoms and I will help you understand what to do next." }
    ])
    const [input, setInput]     = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef             = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior:"smooth" })
    }, [messages, loading])

    const time = () => new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })

    const send = (text) => {
        const val = (text || input).trim()
        if (!val || loading) return
        setMessages(p => [...p, { role:"user", text:val, time:time() }])
        setInput("")
        setLoading(true)
        // Simulate API call — replace with real Spring Boot call later
        setTimeout(() => {
            setMessages(p => [...p, { role:"bot", text:getReply(val), time:time() }])
            setLoading(false)
        }, 1500)
    }

    return (
        <div style={S.wrap}>
            <h1 style={S.title}>AI <span style={S.green}>Symptom</span> Checker</h1>
            <p style={S.desc}>Describe your symptoms and get guidance on which specialist to visit. Not a diagnosis — always see a doctor.</p>

            <div style={S.layout}>

                {/* ── CHAT ── */}
                <div style={S.chatBox}>
                    {/* Header */}
                    <div style={S.chatHead}>
                        <div style={S.chatAv}>🤖</div>
                        <div>
                            <div style={S.chatName}>HealthSetu AI</div>
                            <div style={S.chatStatus}>
                                <span style={S.statusDot} />
                                Online · Ready to help
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={S.msgs}>
                        {messages.map((m, i) => (
                            <div key={i} style={m.role === "user" ? S.msgUser : S.msgBot}>
                                <div style={m.role === "user" ? S.bubbleUser : S.bubbleBot}>
                                    {m.text.split("\n").map((line, j) => (
                                        <span key={j}>{line}{j < m.text.split("\n").length - 1 && <br />}</span>
                                    ))}
                                </div>
                                <div style={m.role === "user" ? S.msgTimeR : S.msgTime}>
                                    {m.time || time()}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div style={S.typingWrap}>
                                {[0,1,2].map(i => (
                                    <div key={i} style={{
                                        ...S.typingDot,
                                        animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`
                                    }} />
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={S.inputRow}>
                        <input
                            style={S.input}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && send()}
                            placeholder="e.g. fever, cough, headache..."
                            onFocus={e => e.target.style.borderColor = "#0dce8f"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                        />
                        <button style={S.sendBtn} onClick={() => send()}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                                 stroke="black" strokeWidth="2.5">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <div>
                    <div style={S.disclaimer}>
                        ⚠️ This is AI guidance only — not a medical diagnosis. Always consult a qualified doctor.
                    </div>
                    <div style={S.qlabel}>Quick examples</div>
                    <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" }}>
                        {QUICK.map((q, i) => (
                            <button
                                key={i}
                                style={{
                                    ...S.qchip,
                                    borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                                    borderBottom: i === QUICK.length-1 ? "none" : undefined,
                                }}
                                onClick={() => send(q.value)}
                                onMouseEnter={e => { e.currentTarget.style.background="#192820"; e.currentTarget.style.color="#0dce8f"; e.currentTarget.style.paddingLeft="20px" }}
                                onMouseLeave={e => { e.currentTarget.style.background="#13201a"; e.currentTarget.style.color="#7da895"; e.currentTarget.style.paddingLeft="16px" }}
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bounce animation */}
            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); background: #456659; }
          40% { transform: translateY(-7px); background: #0dce8f; }
        }
      `}</style>
        </div>
    )
}