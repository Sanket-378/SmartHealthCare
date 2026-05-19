import { useState } from "react";
import { Bot, Mic, Send, ShieldPlus, HeartPulse } from "lucide-react";

export default function AIChatbot() {
  const [message, setMessage] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #07110d 0%, #0b1813 45%, #10221a 100%)",
        borderRadius: "28px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(13,206,143,0.12)",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "#0dce8f",
          opacity: 0.05,
          filter: "blur(120px)",
          top: "-180px",
          right: "-100px",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "28px 34px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(7,17,13,0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "rgba(13,206,143,0.12)",
              border: "1px solid rgba(13,206,143,0.25)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Bot size={34} color="#0dce8f" />
          </div>

          <div>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: "800",
                margin: 0,
                color: "#f5fff9",
                fontFamily: "Syne, sans-serif",
                letterSpacing: "-1px",
              }}
            >
              AI Healthcare Assistant
            </h1>

            <p
              style={{
                marginTop: "6px",
                color: "#7da895",
                fontSize: "15px",
              }}
            >
              Smart symptom guidance • AI health support • 24×7 assistance
            </p>
          </div>
        </div>

        {/* Language */}
        <select
          style={{
            background: "#13201a",
            color: "#e4f2ec",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "12px 18px",
            outline: "none",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Marathi</option>
        </select>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "34px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          minHeight: "70vh",
        }}
      >
        {/* Welcome Card */}
        <div
          style={{
            maxWidth: "720px",
            background: "rgba(19,32,26,0.92)",
            border: "1px solid rgba(13,206,143,0.18)",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <HeartPulse size={24} color="#0dce8f" />
            <span
              style={{
                color: "#0dce8f",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              Welcome to HealthSetu AI
            </span>
          </div>

          <p
            style={{
              color: "#d9efe6",
              fontSize: "20px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            👋 Hello! I’m your intelligent healthcare assistant.
            <br />
            Ask about symptoms, medicines, nearby hospitals, medical reports,
            or preventive healthcare guidance.
          </p>
        </div>

        {/* Suggestion Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "18px",
          }}
        >
          {[
            "🤒 I have fever and headache",
            "💊 Explain my medicine dosage",
            "🩺 Find nearby hospitals",
            "📋 Analyze my medical report",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#13201a",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "20px",
                color: "#d9efe6",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(13,206,143,0.35)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div
          style={{
            background: "rgba(13,206,143,0.08)",
            border: "1px solid rgba(13,206,143,0.18)",
            borderRadius: "18px",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#bde9d7",
            marginTop: "8px",
          }}
        >
          <ShieldPlus color="#0dce8f" size={24} />
          Your conversations are secure and designed to provide general
          healthcare guidance — not emergency medical diagnosis.
        </div>
      </div>

      {/* Bottom Input */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 5,
          padding: "24px 30px",
          background: "rgba(7,17,13,0.9)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "#13201a",
            border: "1px solid rgba(13,206,143,0.15)",
            borderRadius: "24px",
            padding: "16px 18px",
          }}
        >
          {/* Input */}
          <input
            type="text"
            placeholder="Ask your healthcare question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e4f2ec",
              fontSize: "17px",
            }}
          />

          {/* Mic */}
          <button
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              border: "none",
              background: "rgba(13,206,143,0.12)",
              color: "#0dce8f",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Mic size={22} />
          </button>

          {/* Send */}
          <button
            style={{
              border: "none",
              background: "#0dce8f",
              color: "#000",
              padding: "15px 24px",
              borderRadius: "18px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}