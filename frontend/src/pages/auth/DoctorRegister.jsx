import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SPECIALIZATIONS = [
    "General Physician", "Cardiologist", "Dermatologist",
    "Neurologist", "Orthopaedician", "Gynaecologist",
    "Paediatrician", "Psychiatrist", "Ophthalmologist",
    "ENT Specialist", "Gastroenterologist", "Urologist",
    "Oncologist", "Endocrinologist", "Pulmonologist",
]

const S = {
    page: {
        minHeight: "100vh", background: "#080f0c",
        display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px 20px",
    },
    card: {
        background: "#0c1812", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "36px", width: "100%", maxWidth: 580,
        position: "relative", overflow: "hidden",
    },
    topLine: {
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,#0dce8f,transparent)",
    },
    logo: { fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e4f2ec", marginBottom:4 },
    subtitle: { fontSize:13, color:"#7da895", marginBottom:24 },
    sectionLabel: {
        fontSize:11, fontWeight:700, letterSpacing:"1.8px", color:"#456659",
        textTransform:"uppercase", marginBottom:14, marginTop:20,
        paddingBottom:8, borderBottom:"1px solid rgba(255,255,255,0.05)",
    },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
    fieldWrap: { marginBottom:14 },
    label: { fontSize:12, fontWeight:600, color:"#7da895", letterSpacing:"0.5px", marginBottom:6, display:"block" },
    input: {
        width:"100%", background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", transition:"border-color 0.2s",
    },
    select: {
        width:"100%", background:"#080f0c", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10, padding:"12px 14px", fontSize:14, color:"#e4f2ec",
        outline:"none", fontFamily:"DM Sans,sans-serif", cursor:"pointer",
    },
    uploadZone: {
        width:"100%", border:"2px dashed rgba(13,206,143,0.25)",
        borderRadius:10, padding:"20px", textAlign:"center",
        cursor:"pointer", transition:"all 0.2s", background:"rgba(13,206,143,0.03)",
    },
    uploadIcon: { fontSize:32, marginBottom:8 },
    uploadText: { fontSize:13, color:"#7da895", marginBottom:4 },
    uploadHint: { fontSize:11, color:"#456659" },
    uploadSuccess: { fontSize:13, color:"#0dce8f", marginTop:6, fontWeight:600 },
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
        borderRadius:12, padding:"20px", fontSize:14, color:"#0dce8f",
        textAlign:"center", marginBottom:14, lineHeight:1.7,
    },
    backLink: { fontSize:13, color:"#7da895", textAlign:"center", marginTop:20 },
    linkSpan: { color:"#0dce8f", fontWeight:600, cursor:"pointer" },
    pendingCard: {
        background:"rgba(13,206,143,0.07)", border:"1px solid rgba(13,206,143,0.2)",
        borderRadius:16, padding:"32px 24px", textAlign:"center",
    },
    pendingIcon: { fontSize:56, marginBottom:16 },
    pendingTitle: { fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#0dce8f", marginBottom:10 },
    pendingText: { fontSize:14, color:"#7da895", lineHeight:1.7, marginBottom:20 },
    pendingSteps: { display:"flex", flexDirection:"column", gap:10, textAlign:"left", marginBottom:24 },
    pendingStep: {
        display:"flex", alignItems:"flex-start", gap:12,
        background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 14px",
    },
    pendingStepNum: {
        width:24, height:24, background:"#0dce8f", color:"#000",
        borderRadius:"50%", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0,
    },
    pendingStepText: { fontSize:13, color:"#7da895", lineHeight:1.5 },
}

const focus = e => e.target.style.borderColor = "#0dce8f"
const blur  = e => e.target.style.borderColor = "rgba(255,255,255,0.10)"

export default function DoctorRegister() {
    const navigate = useNavigate()
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading]     = useState(false)
    const [error, setError]         = useState("")
    const [licenseFile, setLicenseFile] = useState(null)

    const [form, setForm] = useState({
        name:"", email:"", phone:"", password:"", confirmPassword:"",
        specialization:"", qualification:"", experience:"",
        clinicName:"", address:"", city:"", pincode:"", fee:"",
    })

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) setLicenseFile(file)
    }

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
        if (!form.specialization) {
            setError("Please select your specialization."); return
        }
        if (!licenseFile) {
            setError("Please upload your medical license."); return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("email", form.email)
            formData.append("password", form.password)
            formData.append("phone", form.phone)
            formData.append("specialization", form.specialization)
            formData.append("qualification", form.qualification)
            formData.append("experience", form.experience)
            formData.append("clinicName", form.clinicName)
            formData.append("address", form.address)
            formData.append("city", form.city)
            formData.append("pincode", form.pincode)
            formData.append("fee", form.fee)
            formData.append("license", licenseFile)

            const res = await fetch("http://localhost:8080/api/auth/register/doctor", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Registration failed")

            setSubmitted(true)

        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    // Show pending screen after successful submission
    if (submitted) {
        return (
            <div style={S.card}>
                <div style={S.topLine} />
                <div style={S.pendingCard}>
                    <div style={S.pendingIcon}>⏳</div>
                    <div style={S.pendingTitle}>Application Submitted!</div>
                    <div style={S.pendingText}>
                        Your registration is under review. Our admin team will verify
                        your medical license and approve your account.
                    </div>
                    <div style={S.pendingSteps}>
                        {[
                            { num:"1", text:"Your medical license has been uploaded successfully" },
                            { num:"2", text:"Admin will review your documents within 24-48 hours" },
                            { num:"3", text:"You will receive an email once your account is approved" },
                            { num:"4", text:"After approval, you can log in and set up your profile" },
                        ].map(s => (
                            <div key={s.num} style={S.pendingStep}>
                                <div style={S.pendingStepNum}>{s.num}</div>
                                <div style={S.pendingStepText}>{s.text}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        style={{ ...S.btn, marginTop:0 }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={S.card}>
            <div style={S.topLine} />
            <div style={S.logo}>
                Health<span style={{ color:"#0dce8f" }}>Setu</span>
            </div>
            <div style={S.subtitle}>Doctor registration — your license will be verified by admin</div>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleSubmit}>

                {/* Personal Info */}
                <div style={S.sectionLabel}>👤 Personal Information</div>
                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Full name *</label>
                        <input style={S.input} placeholder="Dr. Amit Sharma"
                               value={form.name} onChange={set("name")} onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Phone *</label>
                        <input style={S.input} placeholder="9876543210" type="tel"
                               value={form.phone} onChange={set("phone")} onFocus={focus} onBlur={blur}/>
                    </div>
                </div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Email address *</label>
                    <input style={S.input} placeholder="doctor@example.com" type="email"
                           value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur}/>
                </div>
                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Password *</label>
                        <input style={S.input} placeholder="Min 6 characters" type="password"
                               value={form.password} onChange={set("password")} onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Confirm password *</label>
                        <input style={S.input} placeholder="Repeat password" type="password"
                               value={form.confirmPassword} onChange={set("confirmPassword")} onFocus={focus} onBlur={blur}/>
                    </div>
                </div>

                {/* Professional Info */}
                <div style={S.sectionLabel}>🩺 Professional Information</div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Specialization *</label>
                    <select style={S.select} value={form.specialization}
                            onChange={set("specialization")}>
                        <option value="">Select your specialization</option>
                        {SPECIALIZATIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Qualification *</label>
                        <input style={S.input} placeholder="MBBS, MD..."
                               value={form.qualification} onChange={set("qualification")} onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Experience (years) *</label>
                        <input style={S.input} placeholder="5" type="number"
                               value={form.experience} onChange={set("experience")} onFocus={focus} onBlur={blur}/>
                    </div>
                </div>

                {/* Clinic Info */}
                <div style={S.sectionLabel}>🏥 Clinic Information</div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Clinic name *</label>
                    <input style={S.input} placeholder="City Care Clinic"
                           value={form.clinicName} onChange={set("clinicName")} onFocus={focus} onBlur={blur}/>
                </div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Clinic address *</label>
                    <input style={S.input} placeholder="123 Main Street, Near Bus Stand"
                           value={form.address} onChange={set("address")} onFocus={focus} onBlur={blur}/>
                </div>
                <div style={S.grid2}>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>City *</label>
                        <input style={S.input} placeholder="Pune"
                               value={form.city} onChange={set("city")} onFocus={focus} onBlur={blur}/>
                    </div>
                    <div style={S.fieldWrap}>
                        <label style={S.label}>Pincode *</label>
                        <input style={S.input} placeholder="411001"
                               value={form.pincode} onChange={set("pincode")} onFocus={focus} onBlur={blur}/>
                    </div>
                </div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Consultation fee (₹) *</label>
                    <input style={S.input} placeholder="500"  type="number"
                           value={form.fee} onChange={set("fee")} onFocus={focus} onBlur={blur}/>
                </div>

                {/* License Upload */}
                <div style={S.sectionLabel}>📄 Medical License</div>
                <div style={S.fieldWrap}>
                    <label style={S.label}>Upload medical license / certificate *</label>
                    <label style={{
                        ...S.uploadZone,
                        borderColor: licenseFile ? "rgba(13,206,143,0.5)" : "rgba(13,206,143,0.25)",
                        display: "block",
                    }}>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                               onChange={handleFileChange} style={{ display:"none" }}/>
                        <div style={S.uploadIcon}>{licenseFile ? "✅" : "📋"}</div>
                        <div style={S.uploadText}>
                            {licenseFile ? licenseFile.name : "Click to upload your medical license"}
                        </div>
                        <div style={S.uploadHint}>PDF, JPG, PNG — max 5MB</div>
                        {licenseFile && (
                            <div style={S.uploadSuccess}>File selected — ready to upload</div>
                        )}
                    </label>
                </div>

                <button type="submit" style={S.btn} disabled={loading}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {loading ? "Submitting application..." : "Submit Doctor Registration"}
                </button>
            </form>

            <div style={S.backLink}>
                Already have an account?{" "}
                <span style={S.linkSpan} onClick={() => navigate("/login")}>Sign in</span>
            </div>
        </div>
    )
}