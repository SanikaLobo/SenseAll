<div align="center">
  <img src="public/favicon.ico" alt="SenseAll Logo" width="100" />
  
  # SenseAll 🌐🤟
  
  **Empowering seamless communication through AI-driven Indian Sign Language (ISL) recognition.**
  
  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![MediaPipe](https://img.shields.io/badge/MediaPipe-Vision-green.svg?style=for-the-badge&logo=google)](https://developers.google.com/mediapipe)
  [![Roboflow](https://img.shields.io/badge/Roboflow-ISL-purple.svg?style=for-the-badge)](https://roboflow.com/)
  
</div>

---

## ✨ Features

- **Real-Time ISL Translation**: Converts 18 distinct Indian Sign Language gestures into text instantly.
- **Hybrid AI Pipeline**:
  - **MediaPipe HandLandmarker**: Primary inference engine using skeletal distance geometry for lightning-fast, rotation-invariant gesture recognition (Thumbs-Up, Salute, Namaste, etc).
  - **Roboflow Computer Vision**: Fallback inference model to accurately identify complex flat-palm gestures.
- **Natural Language Generation**: Uses **Google Gemini 1.5 Flash** to intelligently convert a sequence of raw gesture tags into grammatically correct English sentences.
- **Robust Filtering**: Advanced multi-frame sliding window voting system prevents jitter and eliminates background noise/face false-positives.

---

## 🤟 Supported ISL Gestures

The robust hybrid AI system recognizes the following gestures with high precision:

| Gesture | Meaning | Mechanism | 
| :---: | :--- | :--- |
| 🙏 | **Namaste** | MediaPipe (2 hands, wrist proximity) |
| 🇮🇳 | **Indian / Salute** | MediaPipe (horizontal palm at head level) |
| 👍 | **Good / Fine** | MediaPipe (thumb extension) |
| 🏠 | **Home** | MediaPipe (fingertip triangle) |
| 🫵 | **I (Self)** | MediaPipe (index pointing) |
| 🏷️ | **Name** | MediaPipe (V-sign) |
| ✅ | **Yes / Confirm** | MediaPipe (Fist) |
| 🌱 | **Live** | MediaPipe (Both hands raised) |
| 🦻 | **Deaf** | MediaPipe (3 fingers) |
| ⏰ | **Time** | MediaPipe (Tapping wrist) |
| 👋 | **Hello / Bye / Thank You** | MediaPipe + Roboflow Fusion |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SanikaLobo/SenseAll.git
   cd SenseAll
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open `http://localhost:8081` in your browser.

> **Note**: Camera access requires localhost or an HTTPS connection.

---

## ⚙️ How the Detection Pipeline Works

1. **Gatekeeper (MediaPipe)**: We extract 21 3D landmarks per hand. If no hands are detected, the pipeline halts—saving compute and preventing face-detection false positives.
2. **Geometric Classification**: We measure the Euclidean distances between the wrist and fingertips vs. PIP joints. This calculates finger curl state completely independent of camera angle (rotation invariant).
3. **Roboflow Fallback**: If the skeletal geometry matches a broad category (like an open hand), the image frame is passed to the Roboflow CNN to differentiate between similar gestures (e.g., Hello vs. Thank You).
4. **Majority Voting**: Gestures are fed into an 8-frame sliding window. A gesture must achieve a 62.5% majority (5/8 votes) to be confirmed, effectively eliminating single-frame noise.

---

## 🛠️ Built With

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **AI & Vision**: [@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision) + [Roboflow.js](https://docs.roboflow.com/roboflow.js)
- **NLP**: [Google Gemini Pro API](https://ai.google.dev/)

---

<div align="center">
  <p>Built with ❤️ for accessible communication.</p>
</div>
