const daysEl = document.querySelector('#days');
const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#mins');
const secondsEl = document.querySelector('#seconds');

const newYears = '01 Jan 2024';

function countdown() {
  const newYearsDate = new Date(newYears);
  const currentDate = new Date();

  const totalSeconds = (newYearsDate - currentDate) / 1000;

  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds) % 60;

  daysEl.innerHTML = format(days);
  hoursEl.innerHTML = format(hours);
  minutesEl.innerHTML = format(mins);
  secondsEl.innerHTML = format(seconds);
}

function format(time) {
	return time < 10 ? (`0${time}`) : time;
}

// call
countdown();

setInterval(countdown, 1000);
