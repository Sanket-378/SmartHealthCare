import { NavLink } from "react-router-dom"

const NAV = [
    { to: "/",         icon: "🏠", label: "Home" },
    { to: "/symptom",  icon: "🩺", label: "Symptom Checker", badge: "AI" },
    { to: "/nearcare", icon: "📍", label: "NearCare" },
    { to: "/report",   icon: "📋", label: "Report Analyzer",  badge: "AI" },
    { to: "/medicine", icon: "💊", label: "Medicine Safety" },
]

export default function Sidebar({ isOpen, onClose }) {
    return (
        <aside style={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            width: "248px", zIndex: 200,
            background: "#0c1812",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column",
            transform: isOpen ? "translateX(0)" : undefined,
            transition: "transform 0.3s ease",
        }}>

            {/* Logo */}
            <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>
                    Health<span style={{ color:"#0dce8f" }}>Setu</span>
                    <span style={{ width:8, height:8, background:"#0dce8f", borderRadius:"50%", animation:"pulse 2s infinite", flexShrink:0 }} />
                </div>
                <div style={{ fontSize:11, color:"#456659", marginTop:4, letterSpacing:0.3 }}>
                    AI Healthcare · Pan-India
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1.8px", color:"#456659", textTransform:"uppercase", padding:"0 8px", marginBottom:8 }}>
                    Navigation
                </div>
                {NAV.map(({ to, icon, label, badge }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "10px 12px", borderRadius: 10, marginBottom: 3,
                            border: `1px solid ${isActive ? "rgba(13,206,143,0.22)" : "transparent"}`,
                            background: isActive ? "rgba(13,206,143,0.10)" : "transparent",
                            color: isActive ? "#0dce8f" : "#7da895",
                            textDecoration: "none", cursor: "pointer",
                            transition: "all 0.2s",
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <div style={{
                                    width: 33, height: 33, borderRadius: 9, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 15,
                                    background: isActive ? "#0dce8f" : "#192820",
                                    color: isActive ? "#000" : "inherit",
                                }}>
                                    {icon}
                                </div>
                                <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{label}</span>
                                {badge && (
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, padding: "2px 6px",
                                        background: "#0dce8f", color: "#000", borderRadius: 10,
                                    }}>
                    {badge}
                  </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Emergency */}
            <div style={{ padding:16, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{
                    background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.17)",
                    borderRadius: 10, padding: "11px 13px",
                }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#ff4d6d", letterSpacing:"0.6px", textTransform:"uppercase", marginBottom:8 }}>
                        ⚡ Emergency
                    </div>
                    {[["Ambulance","108"],["Health Line","104"],["Mother & Child","102"]].map(([label, num]) => (
                        <div key={num} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#7da895", marginBottom:4 }}>
                            <span>{label}</span>
                            <span style={{ fontWeight:700, color:"#e4f2ec", fontFamily:"Syne,sans-serif", fontSize:13 }}>{num}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}