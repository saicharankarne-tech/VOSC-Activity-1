/**
 * Ludo Classic - Complete Game Engine
 * VOSC Activity-1
 * Pure HTML5, CSS3, and Vanilla JavaScript
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundController {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playRoll() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 250, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.08);
      }
    }

    playStep(stepNum = 1) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 380 + (stepNum % 8) * 40;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }

    playCapture() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    playHome() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      });
    }

    playWin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const chordNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chordNotes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });
    }
  }

  // --- CONFETTI CANNON ---
  class ConfettiCannon {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize = this.resize.bind(this);
      window.addEventListener('resize', this.resize);
      this.resize();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst() {
      if (!this.canvas || !this.ctx) return;
      this.resize();
      this.particles = [];
      const colors = ['#e53935', '#2e7d32', '#f9a825', '#1565c0', '#a855f7', '#ec4899', '#ffffff'];

      for (let i = 0; i < 150; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          w: Math.random() * 10 + 6,
          h: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 22,
          vy: (Math.random() - 0.5) * 22 - 6,
          gravity: 0.35,
          drag: 0.96,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          opacity: 1
        });
      }

      if (this.animId) cancelAnimationFrame(this.animId);
      this.animate();
    }

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let alive = 0;
      this.particles.forEach(p => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.006;

        if (p.opacity > 0 && p.y < this.canvas.height + 20) {
          alive++;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          this.ctx.restore();
        }
      });

      if (alive > 0) {
        this.animId = requestAnimationFrame(() => this.animate());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    clear() {
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = [];
    }
  }

  // --- LUDO BOARD COORDINATES & GEOMETRY (15x15) ---
  // Coordinates are 1-based (row: 1..15, col: 1..15) matching CSS Grid
  const COMMON_PATH = [
    { r: 7, c: 2 },  // 0: Red Start (Safe)
    { r: 7, c: 3 },  // 1
    { r: 7, c: 4 },  // 2
    { r: 7, c: 5 },  // 3
    { r: 7, c: 6 },  // 4
    { r: 6, c: 7 },  // 5
    { r: 5, c: 7 },  // 6
    { r: 4, c: 7 },  // 7
    { r: 3, c: 7 },  // 8: Safe Star
    { r: 2, c: 7 },  // 9
    { r: 1, c: 7 },  // 10
    { r: 1, c: 8 },  // 11
    { r: 1, c: 9 },  // 12
    { r: 2, c: 9 },  // 13: Green Start (Safe)
    { r: 3, c: 9 },  // 14
    { r: 4, c: 9 },  // 15
    { r: 5, c: 9 },  // 16
    { r: 6, c: 9 },  // 17
    { r: 7, c: 10 }, // 18
    { r: 7, c: 11 }, // 19
    { r: 7, c: 12 }, // 20
    { r: 7, c: 13 }, // 21: Safe Star
    { r: 7, c: 14 }, // 22
    { r: 7, c: 15 }, // 23
    { r: 8, c: 15 }, // 24
    { r: 9, c: 15 }, // 25
    { r: 9, c: 14 }, // 26: Yellow Start (Safe)
    { r: 9, c: 13 }, // 27
    { r: 9, c: 12 }, // 28
    { r: 9, c: 11 }, // 29
    { r: 9, c: 10 }, // 30
    { r: 10, c: 9 }, // 31
    { r: 11, c: 9 }, // 32
    { r: 12, c: 9 }, // 33
    { r: 13, c: 9 }, // 34: Safe Star
    { r: 14, c: 9 }, // 35
    { r: 15, c: 9 }, // 36
    { r: 15, c: 8 }, // 37
    { r: 15, c: 7 }, // 38
    { r: 14, c: 7 }, // 39: Blue Start (Safe)
    { r: 13, c: 7 }, // 40
    { r: 12, c: 7 }, // 41
    { r: 11, c: 7 }, // 42
    { r: 10, c: 7 }, // 43
    { r: 9, c: 6 },  // 44
    { r: 9, c: 5 },  // 45
    { r: 9, c: 4 },  // 46
    { r: 9, c: 3 },  // 47: Safe Star
    { r: 9, c: 2 },  // 48
    { r: 9, c: 1 },  // 49
    { r: 8, c: 1 },  // 50
    { r: 7, c: 1 }   // 51
  ];

  const HOME_COLUMNS = {
    red: [
      { r: 8, c: 2 },
      { r: 8, c: 3 },
      { r: 8, c: 4 },
      { r: 8, c: 5 },
      { r: 8, c: 6 }
    ],
    green: [
      { r: 2, c: 8 },
      { r: 3, c: 8 },
      { r: 4, c: 8 },
      { r: 5, c: 8 },
      { r: 6, c: 8 }
    ],
    yellow: [
      { r: 8, c: 14 },
      { r: 8, c: 13 },
      { r: 8, c: 12 },
      { r: 8, c: 11 },
      { r: 8, c: 10 }
    ],
    blue: [
      { r: 14, c: 8 },
      { r: 13, c: 8 },
      { r: 12, c: 8 },
      { r: 11, c: 8 },
      { r: 10, c: 8 }
    ]
  };

  const COLOR_CONFIG = {
    red: {
      name: 'Red',
      startIndex: 0,
      startCoord: { r: 7, c: 2 },
      colorHex: '#e53935'
    },
    green: {
      name: 'Green',
      startIndex: 13,
      startCoord: { r: 2, c: 9 },
      colorHex: '#2e7d32'
    },
    yellow: {
      name: 'Yellow',
      startIndex: 26,
      startCoord: { r: 9, c: 14 },
      colorHex: '#f9a825'
    },
    blue: {
      name: 'Blue',
      startIndex: 39,
      startCoord: { r: 14, c: 7 },
      colorHex: '#1565c0'
    }
  };

  const SAFE_PATH_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

  // --- GAME STATE ---
  const soundCtrl = new SoundController();
  let confetti = null;

  const state = {
    playerCount: 4,
    pawnsPerPlayer: 4,
    players: {
      red: { color: 'red', active: true, isAI: false, pawns: [] },
      green: { color: 'green', active: true, isAI: true, pawns: [] },
      yellow: { color: 'yellow', active: true, isAI: true, pawns: [] },
      blue: { color: 'blue', active: true, isAI: true, pawns: [] }
    },
    turnOrder: ['red', 'green', 'yellow', 'blue'],
    currentTurnIndex: 0,
    currentDice: 1,
    hasRolled: false,
    isRolling: false,
    isMoving: false,
    consecutiveSixes: 0,
    isGameOver: false
  };

  // --- DOM ELEMENTS ---
  const boardEl = document.getElementById('ludoBoard');
  const btnRoll = document.getElementById('btnRollDice');
  const diceScene = document.getElementById('diceScene');
  const diceEl = document.getElementById('diceElement');
  const turnColorPill = document.getElementById('turnColorPill');
  const turnText = document.getElementById('turnText');
  const turnMessage = document.getElementById('turnMessage');
  const logTicker = document.getElementById('logTicker');

  const playerCountSelect = document.getElementById('playerCountSelect');
  const pawnCountSelect = document.getElementById('pawnCountSelect');
  const btnNewGame = document.getElementById('btnNewGame');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const btnRules = document.getElementById('btnRules');
  const rulesModal = document.getElementById('rulesModal');
  const btnCloseRules = document.getElementById('btnCloseRules');
  const btnGotIt = document.getElementById('btnGotIt');

  const winnerModal = document.getElementById('winnerModal');
  const winnerText = document.getElementById('winnerText');
  const winnerSubtitle = document.getElementById('winnerSubtitle');
  const btnPlayAgain = document.getElementById('btnPlayAgain');

  // --- BOARD GENERATION ---
  function buildBoardCells() {
    // Generate all 52 common path cells
    COMMON_PATH.forEach((pos, idx) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `cell-common-${idx}`;
      cell.style.gridRow = pos.r;
      cell.style.gridColumn = pos.c;

      // Start squares
      if (idx === 0) cell.classList.add('start-red', 'start-cell');
      else if (idx === 13) cell.classList.add('start-green', 'start-cell');
      else if (idx === 26) cell.classList.add('start-yellow', 'start-cell');
      else if (idx === 39) cell.classList.add('start-blue', 'start-cell');

      // Safe Star squares
      if (SAFE_PATH_INDICES.includes(idx)) {
        cell.classList.add('safe-star');
      }

      boardEl.appendChild(cell);
    });

    // Generate home column cells
    ['red', 'green', 'yellow', 'blue'].forEach(color => {
      HOME_COLUMNS[color].forEach((pos, hIdx) => {
        const cell = document.createElement('div');
        cell.className = `cell home-path-${color}`;
        cell.id = `cell-home-${color}-${hIdx}`;
        cell.style.gridRow = pos.r;
        cell.style.gridColumn = pos.c;
        boardEl.appendChild(cell);
      });
    });
  }

  // --- LOGGING ---
  function addLog(message) {
    if (!logTicker) return;
    const span = document.createElement('span');
    span.className = 'log-entry';
    span.textContent = message;
    logTicker.innerHTML = '';
    logTicker.appendChild(span);
  }

  // --- COORDINATE / TILE LOOKUP ---
  function getTileInfo(color, step) {
    if (step < 0) return { type: 'yard', isSafe: true };
    if (step === 56) return { type: 'goal', isSafe: true };

    if (step <= 50) {
      const startIdx = COLOR_CONFIG[color].startIndex;
      const commonIdx = (startIdx + step) % 52;
      return {
        type: 'common',
        index: commonIdx,
        isSafe: SAFE_PATH_INDICES.includes(commonIdx),
        elementId: `cell-common-${commonIdx}`
      };
    } else {
      const homeIdx = step - 51; // 0..4
      return {
        type: 'home_col',
        color: color,
        index: homeIdx,
        isSafe: true,
        elementId: `cell-home-${color}-${homeIdx}`
      };
    }
  }

  // --- INITIALIZE PAWNS ---
  function initPawns() {
    ['red', 'green', 'yellow', 'blue'].forEach(color => {
      state.players[color].pawns = [];
      for (let i = 0; i < 4; i++) {
        state.players[color].pawns.push({
          id: i,
          color: color,
          state: 'yard', // 'yard' | 'track' | 'home'
          step: -1,
          activeInGame: i < state.pawnsPerPlayer
        });
      }
    });
  }

  // --- UPDATE PLAYER STATS ---
  function updatePlayerStats() {
    ['red', 'green', 'yellow', 'blue'].forEach(color => {
      const p = state.players[color];
      const activePawns = p.pawns.filter(pw => pw.activeInGame);
      const yardCount = activePawns.filter(pw => pw.state === 'yard').length;
      const trackCount = activePawns.filter(pw => pw.state === 'track').length;
      const homeCount = activePawns.filter(pw => pw.state === 'home').length;

      const yardEl = document.getElementById(`stat-${color}-yard`);
      const trackEl = document.getElementById(`stat-${color}-track`);
      const homeEl = document.getElementById(`stat-${color}-home`);

      if (yardEl) yardEl.textContent = yardCount;
      if (trackEl) trackEl.textContent = trackCount;
      if (homeEl) homeEl.textContent = homeCount;
    });
  }

  // --- RENDER BOARD & PAWNS ---
  function renderPawns() {
    // Clear all existing pawns from slots, cells, and center home
    document.querySelectorAll('.pawn').forEach(el => el.remove());
    document.querySelectorAll('.pawn-group').forEach(el => el.remove());

    const cellMap = {}; // elementId -> array of pawns

    // Group pawns by their location
    ['red', 'green', 'yellow', 'blue'].forEach(color => {
      const player = state.players[color];
      if (!player.active) return;

      player.pawns.forEach(pawn => {
        if (!pawn.activeInGame) return;

        if (pawn.state === 'yard') {
          const slot = document.getElementById(`yard-${color}-${pawn.id}`);
          if (slot) {
            const pawnEl = createPawnElement(pawn);
            slot.appendChild(pawnEl);
          }
        } else if (pawn.state === 'home') {
          const homeContainer = document.getElementById('home-tokens-container');
          if (homeContainer) {
            const pawnEl = createPawnElement(pawn);
            pawnEl.style.transform = 'scale(0.85)';
            homeContainer.appendChild(pawnEl);
          }
        } else {
          // On track
          const tileInfo = getTileInfo(color, pawn.step);
          if (tileInfo.elementId) {
            if (!cellMap[tileInfo.elementId]) {
              cellMap[tileInfo.elementId] = [];
            }
            cellMap[tileInfo.elementId].push(pawn);
          }
        }
      });
    });

    // Mount pawns on track cells
    for (const [elementId, pawnsOnCell] of Object.entries(cellMap)) {
      const cellEl = document.getElementById(elementId);
      if (!cellEl) continue;

      if (pawnsOnCell.length === 1) {
        cellEl.appendChild(createPawnElement(pawnsOnCell[0]));
      } else {
        const group = document.createElement('div');
        group.className = `pawn-group count-${pawnsOnCell.length}`;
        pawnsOnCell.forEach(pawn => {
          group.appendChild(createPawnElement(pawn));
        });
        cellEl.appendChild(group);
      }
    }

    updatePlayerStats();
  }

  function createPawnElement(pawn) {
    const el = document.createElement('div');
    el.className = `pawn pawn-${pawn.color}`;
    el.id = `pawn-${pawn.color}-${pawn.id}`;
    el.dataset.color = pawn.color;
    el.dataset.id = pawn.id;

    // Click handler for user movement
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePawnClick(pawn);
    });

    return el;
  }

  // --- DICE ROLLING ---
  function rollDiceValue() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function triggerDiceRoll() {
    const currColor = state.turnOrder[state.currentTurnIndex];
    const currPlayer = state.players[currColor];

    if (state.hasRolled || state.isRolling || state.isMoving || state.isGameOver) return;

    state.isRolling = true;
    btnRoll.disabled = true;
    soundCtrl.playRoll();

    diceEl.classList.add('rolling');

    // Rolling duration: 550ms
    setTimeout(() => {
      diceEl.classList.remove('rolling');
      const rolled = rollDiceValue();
      state.currentDice = rolled;
      diceEl.dataset.face = rolled;
      state.hasRolled = true;
      state.isRolling = false;

      addLog(`${COLOR_CONFIG[currColor].name} rolled a ${rolled}!`);
      handlePostRoll(currColor, rolled);
    }, 550);
  }

  // --- TURN LOGIC & MOVE VALIDATION ---
  function getMovablePawns(color, diceVal) {
    const player = state.players[color];
    const activePawns = player.pawns.filter(p => p.activeInGame);

    return activePawns.filter(pawn => {
      if (pawn.state === 'home') return false;

      if (pawn.state === 'yard') {
        return diceVal === 6;
      }

      if (pawn.state === 'track') {
        return pawn.step + diceVal <= 56;
      }

      return false;
    });
  }

  function handlePostRoll(color, diceVal) {
    const movable = getMovablePawns(color, diceVal);
    const player = state.players[color];

    if (movable.length === 0) {
      turnMessage.textContent = `No moves possible for ${COLOR_CONFIG[color].name}.`;
      setTimeout(() => {
        nextTurn();
      }, 1100);
      return;
    }

    if (player.isAI) {
      turnMessage.textContent = `${COLOR_CONFIG[color].name} (Bot) is deciding...`;
      setTimeout(() => {
        const chosen = chooseBestPawnForAI(color, movable, diceVal);
        executePawnMove(chosen, diceVal);
      }, 700);
    } else {
      // Human turn
      turnMessage.textContent = movable.length === 1
        ? `Click the highlighted pawn to move!`
        : `Choose which pawn to move (${movable.length} options)`;

      highlightMovablePawns(movable);
    }
  }

  function highlightMovablePawns(movable) {
    clearHighlights();
    movable.forEach(pawn => {
      const el = document.getElementById(`pawn-${pawn.color}-${pawn.id}`);
      if (el) el.classList.add('movable');
    });
  }

  function clearHighlights() {
    document.querySelectorAll('.pawn.movable').forEach(el => el.classList.remove('movable'));
  }

  function handlePawnClick(pawn) {
    const currColor = state.turnOrder[state.currentTurnIndex];
    if (currColor !== pawn.color || !state.hasRolled || state.isMoving || state.isGameOver) return;

    const movable = getMovablePawns(currColor, state.currentDice);
    if (!movable.some(p => p.id === pawn.id)) return;

    clearHighlights();
    executePawnMove(pawn, state.currentDice);
  }

  // --- MOVE EXECUTION & STEP ANIMATION ---
  function executePawnMove(pawn, diceVal) {
    state.isMoving = true;
    clearHighlights();
    btnRoll.disabled = true;

    // Yard to Start tile (requires roll of 6)
    if (pawn.state === 'yard') {
      pawn.state = 'track';
      pawn.step = 0;
      soundCtrl.playStep(1);
      renderPawns();
      addLog(`${COLOR_CONFIG[pawn.color].name} deployed pawn #${pawn.id + 1} onto the track!`);

      finishMove(pawn, true); // Deploying out of base grants a bonus roll
      return;
    }

    // Step-by-step track movement
    const startStep = pawn.step;
    const targetStep = pawn.step + diceVal;
    let currentStep = startStep;

    const stepInterval = setInterval(() => {
      currentStep++;
      pawn.step = currentStep;
      soundCtrl.playStep(currentStep);
      renderPawns();

      if (currentStep >= targetStep) {
        clearInterval(stepInterval);

        if (pawn.step === 56) {
          pawn.state = 'home';
          soundCtrl.playHome();
          addLog(`🏁 ${COLOR_CONFIG[pawn.color].name}'s pawn #${pawn.id + 1} reached HOME!`);
          renderPawns();

          // Check if this player won
          if (checkWinCondition(pawn.color)) {
            triggerVictory(pawn.color);
            return;
          }

          // Bonus roll for reaching home
          finishMove(pawn, true);
        } else {
          // Check for capture on target tile
          const captured = checkAndHandleCapture(pawn);
          const bonusRoll = captured || diceVal === 6;
          finishMove(pawn, bonusRoll);
        }
      }
    }, 140);
  }

  function checkAndHandleCapture(activePawn) {
    const tileInfo = getTileInfo(activePawn.color, activePawn.step);
    if (tileInfo.type !== 'common' || tileInfo.isSafe) return false;

    let captured = false;
    ['red', 'green', 'yellow', 'blue'].forEach(oppColor => {
      if (oppColor === activePawn.color) return;
      const oppPlayer = state.players[oppColor];
      if (!oppPlayer.active) return;

      oppPlayer.pawns.forEach(oppPawn => {
        if (!oppPawn.activeInGame || oppPawn.state !== 'track') return;

        const oppTile = getTileInfo(oppColor, oppPawn.step);
        if (oppTile.type === 'common' && oppTile.index === tileInfo.index) {
          // CAPTURE!
          oppPawn.state = 'yard';
          oppPawn.step = -1;
          captured = true;
          soundCtrl.playCapture();
          addLog(`⚔️ ${COLOR_CONFIG[activePawn.color].name} captured ${COLOR_CONFIG[oppColor].name}'s pawn #${oppPawn.id + 1}!`);
        }
      });
    });

    if (captured) {
      renderPawns();
    }
    return captured;
  }

  function finishMove(pawn, earnBonusRoll) {
    state.isMoving = false;

    if (earnBonusRoll) {
      state.consecutiveSixes = (state.currentDice === 6) ? state.consecutiveSixes + 1 : 0;

      if (state.consecutiveSixes >= 3) {
        addLog(`Three 6s in a row for ${COLOR_CONFIG[pawn.color].name}! Turn forfeit.`);
        state.consecutiveSixes = 0;
        nextTurn();
        return;
      }

      turnMessage.textContent = `Bonus roll earned! Roll again!`;
      prepareCurrentPlayerRoll();
    } else {
      state.consecutiveSixes = 0;
      nextTurn();
    }
  }

  function prepareCurrentPlayerRoll() {
    state.hasRolled = false;
    const currColor = state.turnOrder[state.currentTurnIndex];
    const player = state.players[currColor];

    if (player.isAI) {
      btnRoll.disabled = true;
      setTimeout(() => {
        if (!state.isGameOver) triggerDiceRoll();
      }, 700);
    } else {
      btnRoll.disabled = false;
      turnMessage.textContent = `${COLOR_CONFIG[currColor].name}: Click Roll Dice!`;
    }
  }

  // --- TURN SWITCHING ---
  function nextTurn() {
    if (state.isGameOver) return;

    state.hasRolled = false;
    state.isMoving = false;
    state.consecutiveSixes = 0;

    // Advance to next active player
    state.currentTurnIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
    updateTurnUI();

    const currColor = state.turnOrder[state.currentTurnIndex];
    const player = state.players[currColor];

    if (player.isAI) {
      btnRoll.disabled = true;
      turnMessage.textContent = `${COLOR_CONFIG[currColor].name} (Bot) is rolling...`;
      setTimeout(() => {
        if (!state.isGameOver) triggerDiceRoll();
      }, 800);
    } else {
      btnRoll.disabled = false;
      turnMessage.textContent = `${COLOR_CONFIG[currColor].name}'s turn. Roll the dice!`;
    }
  }

  function updateTurnUI() {
    const currColor = state.turnOrder[state.currentTurnIndex];

    turnColorPill.className = `turn-color-pill ${currColor}-bg`;
    turnText.textContent = `${COLOR_CONFIG[currColor].name}'s Turn`;

    // Highlight player card
    document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active-turn'));
    const activeCard = document.getElementById(`card-${currColor}`);
    if (activeCard) activeCard.classList.add('active-turn');
  }

  // --- SMART AI BOT DECISION ENGINE ---
  function chooseBestPawnForAI(color, movablePawns, diceVal) {
    let bestPawn = movablePawns[0];
    let highestScore = -Infinity;

    for (const pawn of movablePawns) {
      let score = 0;
      const targetStep = pawn.state === 'yard' ? 0 : pawn.step + diceVal;

      // 1. Entering Home is top priority
      if (targetStep === 56) {
        score += 10000;
      }
      // 2. Deploying out of base is very high priority
      else if (pawn.state === 'yard') {
        score += 3500;
      }
      // 3. Capturing an opponent
      else {
        const targetTile = getTileInfo(color, targetStep);
        if (targetTile.type === 'common' && !targetTile.isSafe) {
          // Check if any opponent is on this tile
          const hasOpponent = ['red', 'green', 'yellow', 'blue'].some(oppColor => {
            if (oppColor === color || !state.players[oppColor].active) return false;
            return state.players[oppColor].pawns.some(oppP => {
              if (oppP.state !== 'track') return false;
              const oppTile = getTileInfo(oppColor, oppP.step);
              return oppTile.type === 'common' && oppTile.index === targetTile.index;
            });
          });

          if (hasOpponent) {
            score += 6000; // Big bonus for capturing
          }
        }

        // 4. Entering home column is safe and great progress
        if (targetStep >= 51) {
          score += 1500 + targetStep * 20;
        }

        // 5. Landing on a safe star tile
        if (targetTile.isSafe) {
          score += 600;
        }

        // 6. Escape danger if currently on an unsafe tile
        const currentTile = getTileInfo(color, pawn.step);
        if (currentTile.type === 'common' && !currentTile.isSafe) {
          score += 400;
        }

        // 7. General advancement: prioritize moving pawns furthest along
        score += targetStep * 15;
      }

      if (score > highestScore) {
        highestScore = score;
        bestPawn = pawn;
      }
    }

    return bestPawn;
  }

  // --- WIN CONDITION & VICTORY ---
  function checkWinCondition(color) {
    const player = state.players[color];
    const activePawns = player.pawns.filter(p => p.activeInGame);
    return activePawns.length > 0 && activePawns.every(p => p.state === 'home');
  }

  function triggerVictory(color) {
    state.isGameOver = true;
    soundCtrl.playWin();
    if (confetti) confetti.burst();

    winnerText.textContent = `${COLOR_CONFIG[color].name.toUpperCase()} WINS! 🏆`;
    winnerText.style.color = COLOR_CONFIG[color].colorHex;
    winnerSubtitle.textContent = `All pawns safely reached the Home Triangle!`;
    winnerModal.showModal();
    addLog(`🎉 GAME OVER! ${COLOR_CONFIG[color].name} has won the match!`);
  }

  // --- NEW GAME SETUP ---
  function startNewGame() {
    if (confetti) confetti.clear();
    winnerModal.close();
    rulesModal.close();

    state.playerCount = parseInt(playerCountSelect.value, 10);
    state.pawnsPerPlayer = parseInt(pawnCountSelect.value, 10);
    state.isGameOver = false;
    state.isMoving = false;
    state.isRolling = false;
    state.hasRolled = false;
    state.consecutiveSixes = 0;

    // Configure active players
    if (state.playerCount === 2) {
      state.turnOrder = ['red', 'yellow'];
      state.players.red.active = true;
      state.players.yellow.active = true;
      state.players.green.active = false;
      state.players.blue.active = false;
    } else if (state.playerCount === 3) {
      state.turnOrder = ['red', 'green', 'yellow'];
      state.players.red.active = true;
      state.players.green.active = true;
      state.players.yellow.active = true;
      state.players.blue.active = false;
    } else {
      state.turnOrder = ['red', 'green', 'yellow', 'blue'];
      state.players.red.active = true;
      state.players.green.active = true;
      state.players.yellow.active = true;
      state.players.blue.active = true;
    }

    // Update player card visual states
    ['red', 'green', 'yellow', 'blue'].forEach(col => {
      const card = document.getElementById(`card-${col}`);
      if (card) {
        if (state.players[col].active) {
          card.classList.remove('disabled-player');
        } else {
          card.classList.add('disabled-player');
        }
      }
    });

    state.currentTurnIndex = 0;
    initPawns();
    renderPawns();
    updateTurnUI();

    const currColor = state.turnOrder[0];
    const player = state.players[currColor];

    if (player.isAI) {
      btnRoll.disabled = true;
      turnMessage.textContent = `${COLOR_CONFIG[currColor].name} (Bot) will start...`;
      setTimeout(() => {
        triggerDiceRoll();
      }, 900);
    } else {
      btnRoll.disabled = false;
      turnMessage.textContent = `${COLOR_CONFIG[currColor].name}: Roll the dice to start!`;
    }

    addLog(`New game started with ${state.playerCount} players (${state.pawnsPerPlayer} pawns each).`);
  }

  // --- EVENT LISTENERS ---
  function setupEvents() {
    confetti = new ConfettiCannon('confettiCanvas');

    btnRoll.addEventListener('click', () => {
      soundCtrl.init();
      triggerDiceRoll();
    });

    diceScene.addEventListener('click', () => {
      soundCtrl.init();
      const currColor = state.turnOrder[state.currentTurnIndex];
      if (!state.players[currColor].isAI) {
        triggerDiceRoll();
      }
    });

    btnNewGame.addEventListener('click', startNewGame);
    playerCountSelect.addEventListener('change', startNewGame);
    pawnCountSelect.addEventListener('change', startNewGame);
    btnPlayAgain.addEventListener('click', startNewGame);

    btnSoundToggle.addEventListener('click', () => {
      const enabled = soundCtrl.toggle();
      btnSoundToggle.textContent = enabled ? '🔊' : '🔇';
      addLog(enabled ? 'Sound turned ON.' : 'Sound MUTED.');
    });

    // AI toggle buttons on player cards
    ['red', 'green', 'yellow', 'blue'].forEach(color => {
      const toggleBtn = document.getElementById(`ai-toggle-${color}`);
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          state.players[color].isAI = !state.players[color].isAI;
          toggleBtn.textContent = state.players[color].isAI ? '🤖 Bot' : '👤 Human';
          addLog(`${COLOR_CONFIG[color].name} is now controlled by ${state.players[color].isAI ? 'Bot AI' : 'Human'}.`);

          // If it's currently this player's turn and just became AI and hasn't rolled
          const currColor = state.turnOrder[state.currentTurnIndex];
          if (currColor === color && !state.hasRolled && !state.isRolling) {
            prepareCurrentPlayerRoll();
          }
        });
      }
    });

    // Rules modal
    btnRules.addEventListener('click', () => rulesModal.showModal());
    btnCloseRules.addEventListener('click', () => rulesModal.close());
    btnGotIt.addEventListener('click', () => rulesModal.close());
    rulesModal.addEventListener('click', (e) => {
      if (e.target === rulesModal) rulesModal.close();
    });
  }

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', () => {
    buildBoardCells();
    setupEvents();
    startNewGame();
  });
})();
