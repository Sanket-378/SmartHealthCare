import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import BottomNav from "./components/BottomNav"

import Home from "./pages/Home"
import SymptomChecker from "./pages/SymptomChecker"
import NearCare from "./pages/NearCare"
import ReportAnalyzer from "./pages/ReportAnalyzer"
import MedicineSafety from "./pages/MedicineSafety"

import Login from "./pages/auth/Login"
import PatientRegister from "./pages/auth/PatientRegister"
import DoctorRegister from "./pages/auth/DoctorRegister"

import PatientDashboard from "./pages/patient/Dashboard"
import DoctorDashboard from "./pages/doctor/Dashboard"
import AdminDashboard from "./pages/admin/Dashboard"

function AuthLayout({ children }) {
  return (
      <div style={{
        minHeight: "100vh", background: "#080f0c",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        {children}
      </div>
  )
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])

  return (
      <div style={{ display:"flex", minHeight:"100vh", background:"#080f0c", color:"#e4f2ec" }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && !isDesktop && (
            <div onClick={() => setSidebarOpen(false)}
                 style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:190 }} />
        )}
        <div style={{ flex:1, display:"flex", flexDirection:"column", marginLeft: isDesktop ? "248px" : 0 }}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main style={{ flex:1, padding:"40px 48px", paddingTop:40, maxWidth:1280, width:"100%" }}>
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
  )
}

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register/patient" element={<AuthLayout><PatientRegister /></AuthLayout>} />
          <Route path="/register/doctor" element={<AuthLayout><DoctorRegister /></AuthLayout>} />

          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRole="PATIENT">
              <AuthLayout><PatientDashboard /></AuthLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRole="DOCTOR">
              <AuthLayout><DoctorDashboard /></AuthLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="ADMIN">
              <AuthLayout><AdminDashboard /></AuthLayout>
            </ProtectedRoute>
          } />

          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/symptom"  element={<SymptomChecker />} />
                <Route path="/nearcare" element={<NearCare />} />
                <Route path="/report"   element={<ReportAnalyzer />} />
                <Route path="/medicine" element={<MedicineSafety />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
  )
}