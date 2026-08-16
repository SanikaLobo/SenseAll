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

In a world increasingly driven by digital communication, millions of individuals with speech and hearing impairments often find themselves excluded. **SenseAll** is our answer. It is a state-of-the-art accessibility platform that fuses computer vision, natural language processing, and multimodal feedback (visual, auditory, braille, and haptics) into a single, cohesive application.

Why did we build this? Because accessibility isn't an afterthought—it's a necessity. We wanted to build a bridge between Indian Sign Language (ISL) users and the rest of the world, doing so with cutting-edge AI directly in the browser to ensure absolute privacy and zero latency.

---

## ✨ Premium Features

- **Real-Time ISL Translation**: Instantly converts 18 distinct Indian Sign Language gestures into text with edge-based computer vision.
- **Hybrid AI Detection Pipeline**:
  - **MediaPipe HandLandmarker**: Powers the core inference engine. Using 3D skeletal distance geometry, it achieves lightning-fast, **rotation-invariant** gesture recognition (Thumbs-Up, Salute, Namaste, etc.).
  - **Roboflow CNN Fallback**: Kicks in automatically to accurately classify complex flat-palm gestures when skeletal geometry alone is ambiguous.
- **Natural Language Generation**: Uses **Google Gemini 1.5 Flash** to intelligently convert sequences of raw gesture tags into grammatically correct, natural English sentences.
- **Robust Multi-Frame Filtering**: Features an advanced sliding window voting system that requires a 62.5% majority consensus, effectively eliminating camera jitter and background false-positives.
- **Inclusive Multimodal Interface**: Deep integrations with Voice (TTS), digital Braille display, and Haptic feedback.

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

## ⚙️ How the Pipeline Works

1. **Gatekeeper (MediaPipe)**: Extracts 21 3D landmarks per hand. If no hands are detected, the pipeline halts—saving compute and preventing face-detection false positives.
2. **Geometric Classification**: Measures Euclidean distances between the wrist and fingertips vs. PIP joints. This calculates finger curl state independently of camera angle (rotation invariant).
3. **Roboflow Fallback**: If skeletal geometry aligns with a broad category (like an open hand), the frame passes to the Roboflow CNN to differentiate between similar signs.
4. **Majority Voting**: Detections feed into an 8-frame sliding window. A gesture must win a 62.5% majority (5/8 votes) to be confirmed, filtering out noise flawlessly.

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
   Open `http://localhost:8081` in your browser. *(Note: Camera access requires localhost or a secure HTTPS connection).*

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
