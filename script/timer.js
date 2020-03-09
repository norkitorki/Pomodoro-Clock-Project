"use-strict"

// Timer Elements

const timer        = document.getElementById("timer");
const timerDisplay = document.querySelector("div.timer-display");
const startButton  = document.querySelector("button.fa-play");
const progressBar  = document.querySelector("div.progress-bar");

const sessionSound = new Audio("assets/sounds/Bike-bell-ring-sound-effect.mp3");
const breakSound   = new Audio("assets/sounds/Ding-ding-ding-winner-sound-effect.mp3");

// Timer Functionality

const timerReset = new Date("2000 00:00:00");
let timerActive = timerRunning = breakActive = false;
let width = -1;

const progressFunc = function(timer) {
  let seconds = (timer.getTime() - 946681200000) / 1000;
  Number(progressBar.style.width.match(/\d*/)) >= 100 ? width = 0 : width += 1;
  progressBar.style.width = `${(100 / seconds) * width}%`;
};

const toggleBreak = function() {
  if (breakActive) {
    formatTimer(breakDisplay, breakDuration);
    progressFunc(breakReset);
  }
  else {
    formatTimer(sessionDisplay, sessionDuration);
    progressFunc(sessionReset);
  }
};

const styleTimer = function(action) {
  if (action === "running" && timerActive) {
    sessionDisplay.classList.remove("paused");
    breakDisplay.classList.remove("paused");
    breakActive ? breakDisplay.classList.add(action) : breakDisplay.classList.remove(action);
    breakActive ? sessionDisplay.classList.remove(action) : sessionDisplay.classList.add(action);
  }
  else if (action === "paused" && timerActive) breakActive ? breakDisplay.classList.add(action) : sessionDisplay.classList.add(action);
};

const styleDisplay = function() {
  if (timerRunning) {
    progressBar.classList.remove("progress-paused");
    if ((sessionDuration.getTime() < 946681230000 || breakDuration.getTime() < 946681230000)) {
      breakActive ? breakDisplay.classList.add("status-yellow") : sessionDisplay.classList.add("status-yellow");
      progressBar.classList.add("progress-yellow");
    }
    if ((sessionDuration.getTime() < 946681215000 || breakDuration.getTime() < 946681215000)) {
      breakActive ? breakDisplay.classList.replace("status-yellow", "status-red") : sessionDisplay.classList.replace("status-yellow", "status-red");
      progressBar.classList.replace("progress-yellow", "progress-red");
    }
    if ((sessionDuration.getTime() < 946681200000 || breakDuration.getTime() < 946681200000)) {
      breakActive ? breakDisplay.classList.remove("status-red") : sessionDisplay.classList.remove("status-red");
      progressBar.classList.remove("progress-red");
    }
  }
  else {
    sessionDisplay.classList.remove("status-yellow", "status-red");
    breakDisplay.classList.remove("status-yellow", "status-red");
    progressBar.classList.remove("progress-yellow", "progress-red");
    progressBar.classList.add("progress-paused");
  }
};

const session = setInterval( () => {
  if (timerRunning) {
    toggleBreak();
    let zeroHour = 946681200000;
    if (sessionDuration.getTime() < zeroHour) {
      formatTimer(sessionDisplay, sessionReset);
      sessionDuration.setTime(sessionReset.getTime());
      breakSound.play();
      breakActive = true;
    }
    if (breakDuration.getTime() < zeroHour) {
      formatTimer(breakDisplay, breakReset);
      breakDuration.setTime(breakReset.getTime());
      sessionSound.play();
      breakActive = false;
    }
    breakActive ? breakDuration.setMilliseconds(-1) : sessionDuration.setMilliseconds(-1);
    styleTimer("running");
  }
  styleDisplay();
}, 1000);

const togglePause = function(source) {
  if (source !== startButton) return;
  if (timerRunning) {
    startButton.classList.replace("fa-play", "fa-pause");
  }
  else {
    startButton.classList.replace("fa-pause", "fa-play");
    styleTimer("paused");
    styleDisplay("paused");
  }
};

const stopReset = function(source) {
  //if (source.classList.contains("fa-stop") || source.classList.contains("fa-undo")) return;
  breakActive ? breakDisplay.className = "break-display" : sessionDisplay.className = "session-display";
  timerRunning = timerActive = breakActive = false;
  width = -1;
  progressBar.style.width = 0;
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
    }
    else if (e.target.classList.contains("fa-pause")) timerRunning = false;
    else if (e.target.classList.contains("fa-stop") || e.target.classList.contains("fa-undo"))  stopReset(e.target);

    togglePause(startButton);
    lockControls();
  }
  else return;
});
