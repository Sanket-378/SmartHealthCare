import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Send,
  ShieldPlus,
  Activity,
} from "lucide-react";

export default function ReportAnalyzer() {

  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState("English");

  const recognitionRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Upload your medical report and I will explain it in simple language.",
    },
  ]);
const startVoiceInput = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang =
    selectedLanguage === "Hindi"
      ? "hi-IN"
      : selectedLanguage === "Marathi"
      ? "mr-IN"
      : "en-US";

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  recognition.start();

  recognitionRef.current = recognition;

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    setMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.error(event.error);
  };
};

const analyzeReport = async () => {

  if (!selectedFile) {

    alert("Please upload medical report");

    return;
  }

  try {

    // Add user upload message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text:
          message.trim() !== ""
            ? message
            : `Uploaded Report: ${selectedFile.name}`,
      },
    ]);

    // Form Data
    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append(
      "language",
      selectedLanguage
    );

    // Loading message
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "⏳ Analyzing medical report...",
      },
    ]);

    // API Call
    const response = await fetch(
      "http://localhost:8080/api/report/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    // Remove loading and show response
    setMessages((prev) => {

      const updated = [...prev];

      updated.pop();

      updated.push({
        sender: "bot",
        text: data.reply,
      });

      return updated;
    });

    // Clear input
    setMessage("");

  } catch (error) {

    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "❌ Failed to analyze report. Please try again.",
      },
    ]);
  }
};

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

      {/* ================= HEADER ================= */}

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >

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
            <FileText size={34} color="#0dce8f" />
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
              AI Report Analyzer
            </h1>

            <p
              style={{
                marginTop: "6px",
                color: "#7da895",
                fontSize: "15px",
              }}
            >
              Upload medical reports • Understand diseases • Get AI explanation
            </p>

          </div>
        </div>

        <select
          value={selectedLanguage}

          onChange={(e) =>
            setSelectedLanguage(e.target.value)
          }

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

      {/* ================= CHAT AREA ================= */}

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

        {/* Messages */}
        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              alignSelf:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",

              maxWidth: "760px",

              background:
                msg.sender === "user"
                  ? "#0dce8f"
                  : "rgba(19,32,26,0.92)",

              color:
                msg.sender === "user"
                  ? "#000"
                  : "#d9efe6",

              border:
                msg.sender === "bot"
                  ? "1px solid rgba(13,206,143,0.18)"
                  : "none",

              borderRadius: "24px",
              padding: "22px",
              lineHeight: 1.7,
              fontSize: "18px",
            }}
          >
            {msg.text}
          </div>
        ))}

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "18px",
          }}
        >

          {[
            "🩺 Understand medical reports easily",
            "📋 Detect important health indicators",
            "💊 Get treatment guidance",
            "🧠 AI explains everything simply",
          ].map((item) => (

            <div
              key={item}
              style={{
                background: "#13201a",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "20px",
                color: "#d9efe6",
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

          Reports are analyzed securely using AI to provide simple health explanations.
        </div>

      </div>

      {/* ================= INPUT AREA ================= */}

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

          {/* Upload Button */}
          <label
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
            <Upload size={22} />

            <input
              type="file"
              hidden
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
            />
          </label>

          {/* Input */}
          <input
            type="file"
            hidden

            accept=".pdf"

            onChange={(e) => {

              if (!e.target.files || e.target.files.length === 0) {
                return;
              }

              const file = e.target.files[0];

              setSelectedFile(file);
            }}
          />

          {/* Mic */}
          <button
            onClick={startVoiceInput}
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
            <Activity size={22} />
          </button>

         {/* Send */}
         <button

           onClick={analyzeReport}

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
           Analyze
         </button>

        </div>

        {/* File Name */}
        {selectedFile && (
          <div
            style={{
              marginTop: "14px",
              color: "#0dce8f",
              fontSize: "14px",
            }}
          >
            Uploaded File: {selectedFile.name}
          </div>
        )}

      </div>
    </div>
  );
}