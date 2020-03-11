"use-strict"

// Timer Elements

const timer        = document.getElementById("timer");
const timerDisplay = document.querySelector("div.timer-display");
const startButton  = document.querySelector("button.fa-play");
const progressBar  = document.querySelector("div.progress-bar");

const sessionSound = new Audio("assets/sounds/Bike-bell-ring-sound-effect.mp3");
const breakSound   = new Audio("assets/sounds/Ding-ding-ding-winner-sound-effect.mp3");
const timerReset   = new Date("2000 00:00:00");

// Timer Functionality

let interval    = null;
let timerActive = timerRunning = breakActive = false;
let width       = -1;

const session = function() {
  console.log(timerActive);
  if (timerRunning) timerFunction();
  else clearInterval(interval)
  progressFunc();
  updateTitle();
  styleDisplay();
  styleTimer();
  toggleBreak();
};

timer.addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    if (e.target.classList.contains("fa-play")) {
      if (!timerActive && !timerRunning) {
        sessionReset.setTime(sessionDuration.getTime());
        breakReset.setTime(breakDuration.getTime());
        sessionSound.play();
      }
      timerActive = timerRunning = true;
      interval = setInterval(session, 1000);
    }
    else if (e.target.classList.contains("fa-pause")) timerRunning = false;
    else if (e.target.classList.contains("fa-stop") || e.target.classList.contains("fa-undo"))  stopReset(e.target);

    togglePause(startButton);
    lockControls();
  }
  else return;
});

const timerFunction = function() {
  let timer = breakActive ? breakDuration : sessionDuration;
  let zeroHour = 946681200000;
  if (timer.getTime() < zeroHour) { // toggle/untoggle break
    breakActive = !breakActive;
    breakActive ? breakSound.play() : sessionSound.play();
  }
  breakActive ? formatTimer(breakDisplay, breakDuration) : formatTimer(sessionDisplay, sessionDuration);
  breakActive ? breakDuration.setMilliseconds(-1) : sessionDuration.setMilliseconds(-1);
};

const progressFunc = function() {
  let timer = breakActive ? breakReset : sessionReset;
  let seconds = (timer.getTime() - 946681200000) / 1000;
  Number(progressBar.style.width.match(/\d*/)) >= 100 ? width = 0 : width += 1;
  if (!timerRunning) width -= 1;
  progressBar.style.width = `${(100 / seconds) * width}%`
  if (!timerActive) {
    width = -1;
    progressBar.style.width = 0;
  }
};

const updateTitle = function() {
  let timeStamp = breakActive ? `Break | ${breakDisplay.textContent}` : `Session | ${sessionDisplay.textContent}`
  timerActive ? document.title = timeStamp : document.title = "Pomodoro Clock";
  if (!timerActive) document.title = "Pomodoro Clock";
};

const styleDisplay = function() {
  let duration = breakActive ? breakDuration : sessionDuration;
  let display  = breakActive ? breakDisplay : sessionDisplay;
  if (timerRunning) {
    if (duration.getTime() < 946681230000) display.classList.add("status-yellow");
    if (duration.getTime() < 946681215000) display.classList.replace("status-yellow", "status-red");
    if (duration.getTime() < 946681200000) display.classList.remove("status-red");
  }
  else display.classList.remove("status-yellow", "status-red");
};

const styleTimer = function() {
  let action = timerRunning ? "running" : "paused";
  if (timerRunning && timerActive) {
    breakActive ? breakDisplay.classList.remove("paused") : sessionDisplay.classList.remove("paused");
    breakActive ?      breakDisplay.classList.add(action) : breakDisplay.classList.remove(action);
    breakActive ? sessionDisplay.classList.remove(action) : sessionDisplay.classList.add(action);
  }
  else if (!timerRunning && timerActive) breakActive ? breakDisplay.classList.add(action) : sessionDisplay.classList.add(action);
};

const toggleBreak = function() {
  if (breakActive) {
    formatTimer(sessionDisplay, sessionReset);
    sessionDuration.setTime(sessionReset.getTime());
  }
  else {
    formatTimer(breakDisplay, breakReset);
    breakDuration.setTime(breakReset.getTime());
  }
};

const togglePause = function(source) {
  if (source !== startButton) return;
  if (timerRunning) {
    startButton.classList.replace("fa-play", "fa-pause");
  }
  else {
    startButton.classList.replace("fa-pause", "fa-play");
    styleTimer();
    //clearInterval(interval);
  }
};

const stopReset = function(source) {
  breakActive ? breakDisplay.className = "break-display" : sessionDisplay.className = "session-display";
  timerRunning = timerActive = breakActive = false;
  if (source.classList.contains("fa-stop")) {
    sessionDuration.setTime(sessionReset.getTime());
    breakDuration.setTime(breakReset.getTime());
    formatTimer(sessionDisplay, sessionReset);
    formatTimer(breakDisplay, breakReset);
  }
  else if (source.classList.contains("fa-undo")) {
    formatTimer(sessionDisplay, sessionDuration = new Date("2000 00:25:00"));
    formatTimer(breakDisplay,   breakDuration   = new Date("2000 00:05:00"));
  }
  else return;
};
