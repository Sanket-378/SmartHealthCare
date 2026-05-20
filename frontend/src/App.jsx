import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import AIChatbot from "./pages/AIChatbot";
import NearCare from "./pages/NearCare";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import MedicineSafety from "./pages/MedicineSafety";

import Login from "./pages/auth/Login";
import PatientRegister from "./pages/auth/PatientRegister";
import DoctorRegister from "./pages/auth/DoctorRegister";

import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

import FindDoctor from "./pages/patient/FindDoctor"
// ============================
// AUTH LAYOUT
// ============================
import BookAppointment from "./pages/patient/BookAppointment"

function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080f0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}


// ============================
// MAIN APP LAYOUT
// ============================

function AppLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isDesktop, setIsDesktop] =
    useState(window.innerWidth >= 1024);

  useEffect(() => {

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#080f0c",
        color: "#e4f2ec",
        fontFamily: "DM Sans, sans-serif",
      }}
    >

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 190,
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          marginLeft: isDesktop ? "248px" : 0,
        }}
      >

        {/* Topbar */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Pages */}
        <main
          style={{
            flex: 1,
            padding: "40px 48px",
            paddingTop: 40,
            maxWidth: "1280px",
            width: "100%",
          }}
        >
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

      </div>
    </div>
  );
}


// ============================
// PROTECTED ROUTES
// ============================

function ProtectedRoute({ children, allowedRole }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ============================
// MAIN APP
// ============================

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* AUTH ROUTES */}
        {/* ========================= */}

          <Route path="/patient/book/:doctorId" element={<BookAppointment />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/register/patient"
          element={
            <AuthLayout>
              <PatientRegister />
            </AuthLayout>
          }
        />

        <Route
          path="/register/doctor"
          element={
            <AuthLayout>
              <DoctorRegister />
            </AuthLayout>
          }
        />


        {/* ========================= */}
        {/* DASHBOARDS */}
        {/* ========================= */}
          <Route path="/patient/find-doctor" element={<FindDoctor />} />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRole="PATIENT">
              <AuthLayout>
                <PatientDashboard />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <AuthLayout>
                <DoctorDashboard />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AuthLayout>
                <AdminDashboard />
              </AuthLayout>
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* MAIN APP ROUTES */}
        {/* ========================= */}

        <Route
          path="/*"
          element={
            <AppLayout>

              <Routes>

                <Route
                  path="/"
                  element={<Home />}
                />

                {/* AI Chatbot */}
                <Route
                  path="/chatbot"
                  element={<AIChatbot />}
                />

                {/* Existing Pages */}
                <Route
                  path="/nearcare"
                  element={<NearCare />}
                />

                <Route
                  path="/report"
                  element={<ReportAnalyzer />}
                />

                <Route
                  path="/medicine"
                  element={<MedicineSafety />}
                />

              </Routes>

            </AppLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}