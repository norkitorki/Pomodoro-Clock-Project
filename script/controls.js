"use-strict"

// Control Elements

const controls       = document.getElementById("timer-controls");
const sessionTimer   = document.querySelector("div.session-timer");
const breakTimer     = document.querySelector("div.break-timer");
const sessionDisplay = document.querySelector("div.session-display");
const breakDisplay   = document.querySelector("div.break-display");

// Session/Break Timer functionality

let sessionDuration = new Date("Dec 31 1999 00:25:00");
let sessionReset    = new Date("Dec 31 1999 00:00:00");
let breakDuration   = new Date("Dec 31 1999 00:05:00");
let breakReset      = new Date("Dec 31 1999 00:00:00");


const formatTimer = function(display, date) {
  if (date.getHours() < 1 && date.getTime() < 946681200000) {
    display.textContent = date.toString().match(/\d\d:(\d\d:\d\d)/)[1];
  }
  else {
    display.textContent = date.toString().match(/\d\d:\d\d:\d\d/)[0];
  }
  if (date.getTime() >= 946681200000) {
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    display.textContent = `${day}:${display.textContent}`;
  }
};

const lockControls = function() {
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
    else if (e.target.classList.contains("session-down") && sessionDuration.getTime() > 946594900000) {
      sessionDuration.setMinutes(sessionMinutes -= 1);
    }
    else if (e.target.classList.contains("break-up")) {
      breakDuration.setMinutes(breakMinutes += 1);
    }
    else if (e.target.classList.contains("break-down") && breakDuration.getTime() > 946594900000) {
      breakDuration.setMinutes(breakMinutes -= 1);
    }

    formatTimer(sessionDisplay, sessionDuration);
    formatTimer(breakDisplay, breakDuration);
  }
  else return;
});
