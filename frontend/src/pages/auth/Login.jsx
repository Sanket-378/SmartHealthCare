import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const ROLES = [
    { value: "PATIENT", icon: "🧑", label: "Patient" },
    { value: "DOCTOR",  icon: "👨‍⚕️", label: "Doctor" },
    { value: "ADMIN",   icon: "🛡️", label: "Admin" },
]

const S = {
    card: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420,
        position: "relative", overflow: "hidden",
    },
    topLine: {
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    logo: {
        fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800,
        textAlign: "center", marginBottom: 4, color: "#e4f2ec",
    },
    subtitle: { fontSize: 13, color: "#7da895", textAlign: "center", marginBottom: 28 },
    roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 },
    roleBtn: {
        padding: "12px 8px", borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "transparent", color: "#7da895",
        fontSize: 12, fontWeight: 500, cursor: "pointer",
        textAlign: "center", transition: "all 0.2s",
        fontFamily: "DM Sans,sans-serif",
    },
    roleBtnActive: {
        background: "rgba(13,206,143,0.12)",
        border: "1px solid rgba(13,206,143,0.35)",
        color: "#0dce8f",
    },
    label: {
        fontSize: 12, fontWeight: 600, color: "#7da895",
        letterSpacing: "0.5px", marginBottom: 6, display: "block",
    },
    input: {
        width: "100%", background: "#080f0c",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10, padding: "12px 14px",
        fontSize: 14, color: "#e4f2ec", outline: "none",
        marginBottom: 16, fontFamily: "DM Sans,sans-serif",
        transition: "border-color 0.2s",
    },
    btn: {
        width: "100%", padding: 13, background: "#0dce8f",
        border: "none", borderRadius: 10, fontSize: 15,
        fontWeight: 700, color: "#000", cursor: "pointer",
        fontFamily: "DM Sans,sans-serif", marginTop: 4,
    },
    error: {
        background: "rgba(255,77,109,0.10)",
        border: "1px solid rgba(255,77,109,0.25)",
        borderRadius: 8, padding: "10px 14px",
        fontSize: 13, color: "#ff4d6d", marginBottom: 16,
    },
    divider: { textAlign: "center", color: "#456659", fontSize: 13, margin: "20px 0" },
    link: { fontSize: 13, color: "#7da895", textAlign: "center", marginBottom: 8 },
    linkSpan: { color: "#0dce8f", fontWeight: 600, cursor: "pointer" },
}

export default function Login() {
    const navigate    = useNavigate()
    const { login }   = useAuth()
    const [role, setRole]       = useState("PATIENT")
    const [email, setEmail]     = useState("")
    const [password, setPass]   = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) { setError("Please fill in all fields."); return }
        setLoading(true)
        setError("")

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Invalid credentials")
            }

            login(data.user, data.token)

            if (data.user.role === "PATIENT") navigate("/patient/dashboard")
            else if (data.user.role === "DOCTOR") navigate("/doctor/dashboard")
            else if (data.user.role === "ADMIN")  navigate("/admin/dashboard")

        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
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
            <div style={S.subtitle}>Sign in to your account</div>

            {/* Role picker */}
            <div style={S.roleGrid}>
                {ROLES.map(r => (
                    <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        style={role === r.value ? { ...S.roleBtn, ...S.roleBtnActive } : S.roleBtn}
                    >
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                        <div>{r.label}</div>
                    </button>
                ))}
            </div>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <label style={S.label}>Email address</label>
                <input
                    style={S.input} type="email"
                    placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#0dce8f"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                />

                <label style={S.label}>Password</label>
                <input
                    style={S.input} type="password"
                    placeholder="Enter your password"
                    value={password} onChange={e => setPass(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#0dce8f"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                />

                <button
                    type="submit" style={S.btn} disabled={loading}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                    {loading ? "Signing in..." : `Sign in as ${role}`}
                </button>
            </form>

            <div style={S.divider}>— or —</div>

            <div style={S.link}>
                New patient?{" "}
                <span style={S.linkSpan} onClick={() => navigate("/register/patient")}>
          Create account
        </span>
            </div>
            <div style={S.link}>
                Are you a doctor?{" "}
                <span style={S.linkSpan} onClick={() => navigate("/register/doctor")}>
          Register here
        </span>
            </div>
        </div>
    )
}