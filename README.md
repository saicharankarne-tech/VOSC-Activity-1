# 🎲 Ludo Classic — VOSC Activity 1

> **VOSC Activity 1 – Prerequisite Activity**  
> A fully responsive, interactive, and feature-complete Ludo board game built strictly using pure **HTML**, **CSS**, and **JavaScript** (no third-party dependencies or external libraries).

---

## 🌟 Overview

**Ludo Classic** brings the traditional board game to life in the web browser with modern styling, realistic 3D dice physics, customizable player modes, intelligent AI opponents, synthesized sound effects, and celebratory particle animations.

### ✨ Key Features

- **🎮 Flexible Player Modes:**
  - **2 Players:** Red vs. Yellow (classic cross-board match).
  - **3 Players:** Red, Green, and Yellow.
  - **4 Players:** Full board with Red, Green, Yellow, and Blue.
- **🤖 Smart Bot AI / Pass-and-Play:**
  - Toggle each player dynamically between **Human (👤)** and **Bot AI (🤖)**.
  - The AI bot evaluates tactical options: capturing opponents, deploying from base, advancing into safe home columns, and evading threats.
  - Allows solo play against 1, 2, or 3 AI bots, or local pass-and-play with friends!
- **⚡ Game Length Options:**
  - **Classic Mode:** 4 pawns per player.
  - **Fast Mode:** 2 pawns per player for quick games and demonstrations.
- **🎲 3D Animated Dice:**
  - Realistic 3D rotating dice with authentic dot configurations (pips).
  - Smooth roll animations and randomized outcomes.
- **🔊 Built-in Sound Synthesizer (Web Audio API):**
  - Fully synthesized procedural sound effects (dice rolling, pawn movement steps, captures, home milestones, and victory fanfare).
  - No external audio files or network requests required; works 100% offline.
  - Includes a one-click sound mute/unmute toggle.
- **🛡️ Authentic Rules & Safe Zones:**
  - 8 Safe Zones (4 starting squares + 4 star squares `★`) where pawns cannot be captured.
  - Rolling a `6` allows a pawn to leave the yard and grants an **extra roll**.
  - Capturing an opponent's pawn sends it back to the yard and rewards a **bonus roll**.
  - Consecutive sixes limiter (3 sixes rule) to prevent infinite turns.
  - Exact roll required to reach the Home Triangle.
- **🎉 Victory Celebration:**
  - Custom HTML5 Canvas confetti explosion and winner announcement modal.
- **📱 Fully Responsive Design:**
  - Adapts seamlessly to desktop, tablet, and mobile screens.

---

## 📂 Project Structure

As specified in the prerequisite requirements, the project strictly uses only the required core files:

```
VOSC Activity-1/
├── index.html     # Semantic markup for board grid, player cards, 3D dice, and modals
├── style.css      # CSS3 styling, grid layout, 3D transforms, animations, and dark theme
├── script.js     # Complete game engine, board geometry, AI logic, and Web Audio API
└── README.md      # Project documentation, rules, and setup instructions
```

---

## 🚀 How to Run and Play

### Option 1: Direct in Browser (Fastest)
1. Download or clone this repository.
2. Locate the `index.html` file in the folder.
3. Double-click `index.html` (or right-click and choose **Open with** > Google Chrome, Microsoft Edge, Firefox, or Safari).

### Option 2: Using VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (if not already installed).
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Using Python HTTP Server (Command Line)
If you have Python installed, open terminal in the project directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 📖 Rules of the Game

1. **Deploying Pawns:** You must roll a **6** to move a pawn from your Yard to the colored Start tile.
2. **Movement:** Pawns move clockwise along the 52-tile track according to the number rolled on the dice.
3. **Safe Zones (★):** Tiles marked with a star (★) and each player's Start tile are Safe Zones. Pawns on safe zones cannot be captured.
4. **Capturing:** Landing on a non-safe tile occupied by an opponent sends their pawn back to their Yard. The capturing player earns an **immediate bonus roll**!
5. **Bonus Rolls:** Rolling a **6** or making a **capture** gives you another roll.
6. **Home Column & Victory:** Once a pawn completes the circuit, it enters its colored Home Column. Pawns require an exact roll to enter the Center Home Triangle (🏆). The first player to bring all pawns Home wins!

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure, accessible `<dialog>` modals, 15x15 CSS Grid container |
| **CSS3** | Modern dark theme, 3D CSS dice transforms, responsive layout, animations |
| **JavaScript (ES6+)** | Game state management, 52-tile path mapping, capture rules, smart bot AI |
| **Web Audio API** | Real-time synthesized audio effects without external MP3 dependencies |
| **HTML5 Canvas** | Custom multi-colored confetti celebration engine |

---

## 📋 VOSC Submission Details

- **Activity Name:** VOSC Activity 1 – Prerequisite Activity
- **Repository Name:** `VOSC Activity-1`
- **Submission Form:** [Google Form Link](https://forms.gle/1Bu7CXMWrGhYvkZs6)
- **Deadline:** 2nd October 11:59 p.m.

---

*Developed with passion for VOSC Activity-1. Enjoy the game! 🎮*
