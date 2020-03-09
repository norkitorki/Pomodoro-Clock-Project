"use-strict"

// Control Elements

const controls       = document.getElementById("timer-controls");
const sessionTimer   = document.querySelector("div.session-timer");
const breakTimer     = document.querySelector("div.break-timer");
const sessionDisplay = document.querySelector("div.session-display");
const breakDisplay   = document.querySelector("div.break-display");

// Session/Break Timer functionality

let sessionDuration = new Date("2000 00:00:35");
let sessionReset    = new Date("2000 00:00:00");
let breakDuration   = new Date("2000 00:00:32");
let breakReset      = new Date("2000 00:00:00");


function formatTimer(display, date) {
  if (date.getHours() < 1) {
    display.textContent = date.toString().match(/\d\d:(\d\d:\d\d)/)[1];
  } else {
    display.textContent = date.toString().match(/\d\d:\d\d:\d\d/)[0];
  }
};

function lockControls() {
  if (timerActive) {
    controls.querySelectorAll("button").forEach( button => button.classList.add("hidden"));
  } else {
    controls.querySelectorAll("button").forEach( button => button.classList.remove("hidden"));
  }
};

controls.addEventListener("click", (e) => {
  let sessionMinutes = sessionDuration.getMinutes();
  let breakMinutes   = breakDuration.getMinutes();

  if (e.target.nodeName === "BUTTON") {
    if (e.target.classList.contains("session-up")) {
      sessionDuration.setMinutes(sessionMinutes += 1);
    }
    else if (e.target.classList.contains("session-down") && (sessionMinutes > 1 || sessionDuration.getHours() > 0)) {
      sessionDuration.setMinutes(sessionMinutes -= 1);
    }
    else if (e.target.classList.contains("break-up")) {
      breakDuration.setMinutes(breakMinutes += 1);
    }
    else if (e.target.classList.contains("break-down") && (breakMinutes > 1 || breakDuration.getHours() > 0 )) {
      breakDuration.setMinutes(breakMinutes -= 1);
    }

    formatTimer(sessionDisplay, sessionDuration);
    formatTimer(breakDisplay, breakDuration);
  }
  else return;
});
