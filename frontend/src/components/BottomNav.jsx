import { NavLink } from "react-router-dom"

const NAV = [
    { to: "/",         icon: "🏠", label: "Home" },
    { to: "/symptom",  icon: "🩺", label: "Symptoms" },
    { to: "/nearcare", icon: "📍", label: "NearCare" },
    { to: "/report",   icon: "📋", label: "Report" },
    { to: "/medicine", icon: "💊", label: "Medicine" },
]

export default function BottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] lg:hidden
      bg-[#0c1812] border-t border-white/5
      grid grid-cols-5 gap-1 px-2 pt-1.5 pb-4">
            {NAV.map(({ to, icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) => `
            flex flex-col items-center gap-1 py-2 px-1 rounded-[10px] transition-all
            ${isActive ? "text-[#0dce8f] bg-[#0dce8f]/10" : "text-[#456659]"}
          `}
                >
                    <span className="text-lg leading-none">{icon}</span>
                    <span className="text-[9px] font-semibold tracking-wide">{label}</span>
                </NavLink>
            ))}
        </div>
    )
}