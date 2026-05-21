import { useState } from "react"
import { useNavigate } from "react-router-dom"

const S = {
    card: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "36px", width: "100%", maxWidth: 480,
        position: "relative", overflow: "hidden",
    },
    topLine: {
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    logo: { fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e4f2ec", marginBottom:4 },
    subtitle: { fontSize:13, color:"#7da895", marginBottom:28 },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
    fieldWrap: { marginBottom:14 },
    label: { fontSize:12, fontWeight:600, color:"#7da895", letterSpacing:"0.5px", marginBottom:6, display:"block" },
    input: {
        width:"100%", background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", transition:"border-color 0.2s",
    },
    btn: {
        width:"100%", padding:13, background:"#0dce8f", border:"none",
        borderRadius:10, fontSize:15, fontWeight:700, color:"#000",
        cursor:"pointer", marginTop:8, fontFamily:"DM Sans,sans-serif",
    },
    error: {
        background:"rgba(255,77,109,0.10)", border:"1px solid rgba(255,77,109,0.25)",
        borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ff4d6d", marginBottom:14,
    },
    success: {
        background:"rgba(13,206,143,0.10)", border:"1px solid rgba(13,206,143,0.25)",
        borderRadius:8, padding:"10px 14px", fontSize:13, color:"#0dce8f", marginBottom:14,
    },
    backLink: { fontSize:13, color:"#7da895", textAlign:"center", marginTop:20 },
    linkSpan: { color:"#0dce8f", fontWeight:600, cursor:"pointer" },
}

const focus = e => e.target.style.borderColor = "#0dce8f"
const blur  = e => e.target.style.borderColor = "rgba(255,255,255,0.10)"

export default function PatientRegister() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name:"", email:"", phone:"",
        age:"", city:"",
        password:"", confirmPassword:""
    })
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState("")
    const [success, setSuccess] = useState("")

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (!form.name || !form.email || !form.password || !form.phone) {
            setError("Please fill in all required fields."); return
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match."); return
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters."); return
        }
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8080/api/auth/register/patient", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name, email: form.email,
                    password: form.password, phone: form.phone,
                    age: form.age, city: form.city,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Registration failed")
            setSuccess("Account created successfully! Redirecting to login...")
            setTimeout(() => navigate("/login"), 2000)
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={S.card}>
            <div style={S.topLine} />
            <div style={S.logo}>
                Health<span style={{ color:"#0dce8f" }}>Setu</span>
            </div>
            <div style={S.subtitle}>Create your patient account — free forever</div>

            {error   && <div style={S.error}>{error}</div>}
            {success && <div style={S.success}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Full name *</label>
                        <input style={S.input} placeholder="Rahul Sharma"
                               value={form.name} onChange={set("name")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Phone *</label>
                        <input style={S.input} placeholder="9876543210" type="tel"
                               value={form.phone} onChange={set("phone")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                </div>

                <div style={S.fieldWrap}>
                    <label style={S.label}>Email address *</label>
                    <input style={S.input} placeholder="rahul@example.com" type="email"
                           value={form.email} onChange={set("email")}
                           onFocus={focus} onBlur={blur}/>
                </div>

                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Age</label>
                        <input style={S.input} placeholder="25" type="number"
                               value={form.age} onChange={set("age")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>City</label>
                        <input style={S.input} placeholder="Pune"
                               value={form.city} onChange={set("city")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                </div>

                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Password *</label>
                        <input style={S.input} placeholder="Min 6 characters" type="password"
                               value={form.password} onChange={set("password")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Confirm password *</label>
                        <input style={S.input} placeholder="Repeat password" type="password"
                               value={form.confirmPassword} onChange={set("confirmPassword")}
                               onFocus={focus} onBlur={blur}/>
                    </div>
                </div>

                <button type="submit" style={S.btn} disabled={loading}
                        onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    {loading ? "Creating account..." : "Create Patient Account"}
                </button>
            </form>

            <div style={S.backLink}>
                Already have an account?{" "}
                <span style={S.linkSpan} onClick={() => navigate("/login")}>Sign in</span>
            </div>
        </div>
    )
}