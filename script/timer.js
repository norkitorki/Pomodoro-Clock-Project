"use-strict"

// Timer Elements

const timer        = document.getElementById("timer");
const timerDisplay = document.querySelector("div.timer-display");
const startButton  = document.querySelector("button.fa-play");

const sessionSound = new Audio("assets/sounds/Bike-bell-ring-sound-effect.mp3");
const breakSound   = new Audio("assets/sounds/Ding-ding-ding-winner-sound-effect.mp3");

// Timer Functionality

let interval    = null;
let timerActive = timerRunning = breakActive = false;

const session = function() {
  if (timerRunning) timerFunction();
  updateTitle();
  styleTimer();
};

timer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-play")) {
    if (!timerActive && !timerRunning) {
      sessionReset.setTime(sessionDuration.getTime());
      breakReset.setTime(breakDuration.getTime());
      sessionSound.play();
    }
    timerActive = timerRunning = true;
    interval = setInterval(session, 1000);
  }
  else if (e.target.classList.contains("fa-pause")) {
    timerRunning = false;
  }
  else if (e.target.classList.contains("fa-stop") || e.target.classList.contains("fa-undo")) {
    stopReset(e.target);
  }
  else return;

  styleTimer();
  togglePause();
  lockControls();
});

const timerFunction = function() {
  let timer = breakActive ? breakDuration : sessionDuration;
  let reset = 946594800000;
  if (timer.getTime() < reset) {
    breakActive = !breakActive; // toggle/untoggle break
    if (breakActive) {
      breakSound.play()
      sessionDisplay.className = "session-display"
      sessionDuration.setTime(sessionReset.getTime());
      formatTimer(sessionDisplay, sessionDuration);
    } else {
      sessionSound.play();
      breakDisplay.className = "break-display";
      breakDuration.setTime(breakReset.getTime());
      formatTimer(breakDisplay, breakDuration);
    }
  }
  if (breakActive) {
    formatTimer(breakDisplay, breakDuration);
    breakDuration.setMilliseconds(-1);
  } else {
    formatTimer(sessionDisplay, sessionDuration);
    sessionDuration.setMilliseconds(-1);
  }
};

const updateTitle = function() {
  let timeStamp = breakActive ? `Break | ${breakDisplay.textContent}` : `Session | ${sessionDisplay.textContent}`;
  if (!timerRunning) timeStamp = `${timeStamp} (Paused)`;
  timerActive ? document.title = timeStamp : document.title = "Pomodoro Clock";
};

const styleTimer = function() {
  let status   = timerRunning ? "running"     : "paused";
  let duration = breakActive  ? breakDuration : sessionDuration;
  let display  = breakActive  ? breakDisplay  : sessionDisplay;
  if (timerRunning && timerActive) {
    startButton.classList.replace("fa-play", "fa-pause");
    display.classList.remove("paused");
    display.classList.add(status);
    if (duration.getTime() < 946594830000) display.classList.add("status-yellow");
    if (duration.getTime() < 946594815000) display.classList.replace("status-yellow", "status-orange");
    if (duration.getTime() < 946594800000) display.classList.remove("status-orange", status);
  }
  else if (!timerRunning && timerActive) {
    display.classList.remove("status-yellow", "status-red", "running");
    breakActive ? breakDisplay.classList.add(status) : sessionDisplay.classList.add(status);
  }
};

const togglePause = function() {
  if (!timerRunning) {
    startButton.classList.replace("fa-pause", "fa-play");
    updateTitle();
    styleTimer();
    clearInterval(interval);
  }
};

const stopReset = function(source) {
  breakActive ? breakDisplay.className = "break-display" : sessionDisplay.className = "session-display";
  timerRunning = timerActive = breakActive = false;
  updateTitle();
  if (source.classList.contains("fa-stop")) {
    sessionDuration.setTime(sessionReset.getTime());
    breakDuration.setTime(breakReset.getTime());
    formatTimer(sessionDisplay, sessionReset);
    formatTimer(breakDisplay, breakReset);
  }
  else if (source.classList.contains("fa-undo")) {
    formatTimer(sessionDisplay, sessionDuration = new Date("Dec 31 1999 00:25:00"));
    formatTimer(breakDisplay,   breakDuration   = new Date("Dec 31 1999 00:05:00"));
  }
  else return;
};
