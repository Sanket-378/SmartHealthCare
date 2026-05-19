import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import BottomNav from "./components/BottomNav"
import Home from "./pages/Home"
import SymptomChecker from "./pages/SymptomChecker"
import NearCare from "./pages/NearCare"
import ReportAnalyzer from "./pages/ReportAnalyzer"
import MedicineSafety from "./pages/MedicineSafety"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
      <BrowserRouter>
        <div style={{ display:"flex", minHeight:"100vh", background:"#080f0c", color:"#e4f2ec", fontFamily:"DM Sans, sans-serif" }}>

          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {sidebarOpen && (
              <div
                  onClick={() => setSidebarOpen(false)}
                  style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:190 }}
              />
          )}

          {/* Main content — use inline styles for reliability */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            marginLeft: "248px",  /* sidebar width */
          }}>
            <Topbar onMenuClick={() => setSidebarOpen(true)} />

            <main style={{
              flex: 1,
              padding: "40px 48px",
              paddingTop: "40px",
              paddingBottom: "40px",
              maxWidth: "1280px",
              width: "100%",
            }}>
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/symptom"  element={<SymptomChecker />} />
                <Route path="/nearcare" element={<NearCare />} />
                <Route path="/report"   element={<ReportAnalyzer />} />
                <Route path="/medicine" element={<MedicineSafety />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
  )
}