<div align="center">
  <img src="public/favicon.ico" alt="SenseAll Logo" width="120" />
  
  <h1 align="center">SenseAll 🌐🤟</h1>
  
  <p align="center">
    <strong>Breaking barriers, one gesture at a time. Empowering seamless communication through AI-driven Indian Sign Language (ISL) recognition, Voice, Braille, and Haptics.</strong>
  </p>
  
  <div align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18-007ACC.svg?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://developers.google.com/mediapipe"><img src="https://img.shields.io/badge/MediaPipe-Vision-00BFA5.svg?style=for-the-badge&logo=google" alt="MediaPipe" /></a>
    <a href="https://roboflow.com/"><img src="https://img.shields.io/badge/Roboflow-ISL-6706CE.svg?style=for-the-badge" alt="Roboflow" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini-AI-4285F4.svg?style=for-the-badge&logo=google" alt="Gemini" /></a>
  </div>
</div>

---

## 🚀 The Vision

In a world increasingly driven by digital communication, millions of individuals with speech, hearing, and visual impairments often find themselves excluded. **SenseAll** is our answer. It is a state-of-the-art accessibility platform that fuses computer vision, natural language processing, and multimodal feedback into a single, cohesive application.

Why did we build this? Because accessibility isn't an afterthought—it's a necessity. We wanted to build a bidirectional bridge between everyone, regardless of their physical capabilities, doing so with cutting-edge AI directly in the browser to ensure absolute privacy and zero latency.

---

## ✨ Premium Features

### 🤟 Vision: Real-Time ISL Translation
Instantly converts 18 distinct Indian Sign Language gestures into text using a **Hybrid AI Detection Pipeline**:
- **MediaPipe HandLandmarker**: The core inference engine. Using 3D skeletal distance geometry, it achieves lightning-fast, **rotation-invariant** gesture recognition (Thumbs-Up, Salute, Namaste, etc.).
- **Roboflow CNN Fallback**: Kicks in automatically to accurately classify complex flat-palm gestures when skeletal geometry alone is ambiguous.
- **Robust Multi-Frame Filtering**: Features an advanced sliding window voting system requiring a 62.5% majority consensus, effectively eliminating camera jitter and background false-positives.

### 🗣️ Voice: Text-To-Speech (TTS) & Speech-To-Text (STT)
Bidirectional voice translation ensures fluid conversation:
- **Text-to-Speech (TTS)**: Translates confirmed ISL gestures and typed text into natural-sounding, synthesized speech, allowing deaf/mute users to "speak" aloud.
- **Speech-to-Text (STT)**: Transcribes spoken words from other participants into text on the screen, allowing users to read what is being said in real-time.

### 🧠 NLP: Natural Language Generation
Uses **Google Gemini 1.5 Flash** to intelligently convert disjointed sequences of raw ISL gesture tags (e.g., `[hello, i, deaf]`) into grammatically correct, natural English sentences ("Hello, I am deaf.").

### ⠃⠗⠁⠊⠇⠇⠑ Braille & Haptics
Total multimodal integration for the visually impaired:
- **Digital Braille Display**: Dynamically maps incoming text to braille cells on the UI.
- **Haptic Feedback**: Translates incoming interactions into physical vibration pulses (via the Web Haptics API), allowing users to *feel* the communication on supported devices.

---

## 🤟 Supported ISL Gestures

Our hybrid AI system recognizes the following gestures with uncompromising precision:

| Gesture | Meaning | Detection Engine |
| :---: | :--- | :--- |
| 🙏 | **Namaste** | MediaPipe (2 hands, wrist proximity) |
| 🇮🇳 | **Indian / Salute** | MediaPipe (Horizontal palm at head level) |
| 👍 | **Good / Fine** | MediaPipe (Thumb extension geometry) |
| 🏠 | **Home** | MediaPipe (Fingertip triangle) |
| 🫵 | **I (Self)** | MediaPipe (Index pointing) |
| 🏷️ | **Name** | MediaPipe (V-sign) |
| ✅ | **Yes / Confirm** | MediaPipe (Fist) |
| 🌱 | **Live** | MediaPipe (Both hands raised) |
| 🦻 | **Deaf** | MediaPipe (3 fingers) |
| ⏰ | **Time** | MediaPipe (Tapping wrist) |
| 👋 | **Hello / Bye / Thank You** | MediaPipe + Roboflow Fusion |

---

## 💻 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanikaLobo/SenseAll.git
   cd SenseAll
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development engine**
   ```bash
   npm run dev
   ```

4. **Experience the app**
   Open `http://localhost:8081` in your browser. *(Note: Camera and Microphone access require localhost or a secure HTTPS connection).*

---

## 👥 The Team

Designed, engineered, and shipped by an incredible team:

- **Jeet Chavan** — *10584*
- **Sanika Lobo** — *10613*
- **Meet Mangaonkar** — *10616*
- **Yash Masaye** — *10617*

<br/>

<div align="center">
  <p>Built with ❤️ to make the world more accessible.</p>
</div>
