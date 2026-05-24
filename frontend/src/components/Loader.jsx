export default function Loader({ text = "Loading..." }) {
    return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", minHeight:300, gap:16 }}>
            <div style={{
                width:40, height:40, border:"3px solid rgba(13,206,143,0.2)",
                borderTop:"3px solid #0dce8f", borderRadius:"50%",
                animation:"spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize:14, color:"#7da895" }}>{text}</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )
}