import React, { useState } from "react";
import axios from "axios";
import { FaMicrophone, FaCapsules } from "react-icons/fa";

function Medicine() {

    const [medicine, setMedicine] =
        useState("");

    const [response, setResponse] =
        useState("");

    const [language, setLanguage] =
        useState("English");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition =
        SpeechRecognition
            ? new SpeechRecognition()
            : null;

    const startListening = () => {

        if (!recognition) {

            alert("Speech Recognition not supported");

            return;
        }

        recognition.lang =
            language === "Hindi"
                ? "hi-IN"
                : "en-US";

        recognition.start();

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            setMedicine(transcript);
        };
    };

    const searchMedicine = async () => {

        if (!medicine) return;

        setResponse("Loading...");

        try {

            const result =
                await axios.post(

                    "http://localhost:8080/api/medicine/search",

                    {
                        medicine
                    }
                );

            setResponse(result.data);

        } catch (error) {

            console.error(error);

            setResponse(
                "Unable to fetch medicine information."
            );
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #03140f, #071f16)",
                color: "white",
                padding: "30px",
                fontFamily: "sans-serif"
            }}
        >

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "auto"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >

                        <div
                            style={{
                                background: "#00ff99",
                                padding: "15px",
                                borderRadius: "15px",
                                color: "black"
                            }}
                        >
                            <FaCapsules size={28} />
                        </div>

                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "42px"
                                }}
                            >
                                Medicine Safety Checker
                            </h1>

                            <p
                                style={{
                                    color: "#8ab9a7"
                                }}
                            >
                                AI-powered medicine guidance
                            </p>

                        </div>

                    </div>

                    {/* LANGUAGE SELECTOR */}

                    <select
                        value={language}
                        onChange={(e) =>
                            setLanguage(e.target.value)
                        }

                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background: "#0d2a20",
                            color: "white",
                            border: "1px solid #00ff99"
                        }}
                    >
                        <option>English</option>
                        <option>Hindi</option>
                    </select>

                </div>

                {/* SEARCH BOX */}

                <div
                    style={{
                        background:
                            "rgba(255,255,255,0.05)",

                        padding: "25px",

                        borderRadius: "20px",

                        border:
                            "1px solid rgba(0,255,153,0.2)"
                    }}
                >

                    <h2>
                        💊 Search Medicine Information
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px"
                        }}
                    >

                        <input
                            type="text"

                            placeholder="Enter medicine name..."

                            value={medicine}

                            onChange={(e) =>
                                setMedicine(
                                    e.target.value
                                )
                            }

                            style={{
                                flex: 1,
                                padding: "15px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#10261d",
                                color: "white",
                                fontSize: "16px"
                            }}
                        />

                        {/* MIC BUTTON */}

                        <button
                            onClick={startListening}

                            style={{
                                background: "#00ff99",
                                border: "none",
                                borderRadius: "12px",
                                padding: "15px",
                                cursor: "pointer"
                            }}
                        >
                            <FaMicrophone
                                color="black"
                                size={20}
                            />
                        </button>

                        {/* SEARCH BUTTON */}

                        <button
                            onClick={searchMedicine}

                            style={{
                                background: "#00ff99",
                                border: "none",
                                borderRadius: "12px",
                                padding:
                                    "15px 25px",

                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Search
                        </button>

                    </div>

                </div>

                {/* RESPONSE */}

                <div
                    style={{
                        marginTop: "30px",
                        background:
                            "rgba(255,255,255,0.05)",

                        padding: "25px",

                        borderRadius: "20px",

                        whiteSpace: "pre-wrap",

                        lineHeight: "1.8",

                        border:
                            "1px solid rgba(0,255,153,0.2)"
                    }}
                >

                    <h2>
                        🤖 AI Medicine Response
                    </h2>

                    <div
                        style={{
                            color: "#d8fff0",
                            marginTop: "15px"
                        }}
                    >
                        {response}
                    </div>

                </div>

                {/* SAFETY NOTE */}

                <div
                    style={{
                        marginTop: "25px",
                        background:
                            "rgba(0,255,153,0.08)",

                        padding: "20px",

                        borderRadius: "15px",

                        color: "#9ed9c2"
                    }}
                >
                    ⚠️ This information is for
                    educational purposes only.
                    Always consult a doctor before
                    taking medicines.
                </div>

            </div>

        </div>
    );
}

export default Medicine;