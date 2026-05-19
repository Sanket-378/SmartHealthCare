import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import AIChatbot from "./pages/AIChatbot";
import NearCare from "./pages/NearCare";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import MedicineSafety from "./pages/MedicineSafety";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
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

        {/* Overlay */}
        {sidebarOpen && (
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
            marginLeft: "248px",
          }}
        >
          {/* Topbar */}
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Pages */}
          <main
            style={{
              flex: 1,
              padding: "40px 48px",
              maxWidth: "1280px",
              width: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />

              {/* AI Chatbot Page */}
              <Route path="/chatbot" element={<AIChatbot />} />

              {/* Other Pages */}
              <Route path="/nearcare" element={<NearCare />} />
              <Route path="/report" element={<ReportAnalyzer />} />
              <Route path="/medicine" element={<MedicineSafety />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}