import { useState, useEffect } from "react"

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [])

    const colors = {
        success: { bg:"rgba(13,206,143,0.12)", border:"rgba(13,206,143,0.3)", color:"#0dce8f" },
        error:   { bg:"rgba(255,77,109,0.12)", border:"rgba(255,77,109,0.3)", color:"#ff4d6d" },
        warning: { bg:"rgba(255,179,71,0.12)", border:"rgba(255,179,71,0.3)", color:"#ffb347" },
    }[type]

    return (
        <div style={{
            position:"fixed", bottom:24, right:24, zIndex:9999,
            background:colors.bg, border:`1px solid ${colors.border}`,
            borderRadius:12, padding:"14px 18px",
            fontSize:14, color:colors.color, fontWeight:500,
            boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
            animation:"slideIn 0.3s ease",
            maxWidth:320,
        }}>
            {message}
            <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
        </div>
    )
}