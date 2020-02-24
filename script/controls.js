"use-strict"

// Control Elements

const sessionTimer   = document.querySelector("div.session-timer")
const breakTimer     = document.querySelector("div.break-timer")
const sessionDisplay = document.querySelector("div.session-display");
const breakDisplay   = document.querySelector("div.break-display");

// Session/Break Timer functionality

let sessionLength = new Date(`2000 00:25:00`);
let breakLength   = new Date(`2000 00:05:00`);

sessionTimer.addEventListener("click", (e) => {
  let sessionMinutes = sessionLength.getMinutes()

  if (e.target.className === "increment-session") {
    sessionLength.setMinutes(sessionMinutes += 1);
  }
  if (e.target.className === "decrement-session") {
    sessionLength.setMinutes(sessionMinutes -= 1);
  }

  sessionDisplay.textContent = sessionLength.toString().match(/\d\d:\d\d:\d\d/)[0];
});

breakTimer.addEventListener("click", (e) => {
  let minutes = breakLength.getMinutes();
  let hours   = breakLength.getHours();

  if (e.target.className === "increment-break") {
    breakLength.setMinutes(minutes += 1);
  }
  if (e.target.className === "decrement-break" && (minutes > 1 || hours > 0 )) {
    breakLength.setMinutes(minutes -= 1);
  }

  breakDisplay.textContent = breakLength.toString().match(/\d\d:\d\d:\d\d/)[0];
});
