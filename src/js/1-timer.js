import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");
const daysElem = document.querySelector("[data-days]");
const hoursElem = document.querySelector("[data-hours]");
const minutesElem = document.querySelector("[data-minutes]");
const secondsElem = document.querySelector("[data-seconds]");


let userSelectedDate = null;
let timerId = null;

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}


startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    input.disabled = true;
    const futureTime = userSelectedDate;

    timerId = setInterval(() => {
        const nowTime = Date.now();
        const res = futureTime - nowTime;

        if (res <= 0) {
            clearInterval(timerId);

            daysElem.textContent = "00";
            hoursElem.textContent = "00";
            minutesElem.textContent = "00";
            secondsElem.textContent = "00";
            input.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(res);

        daysElem.textContent = addLeadingZero(days);
        hoursElem.textContent = addLeadingZero(hours);
        minutesElem.textContent = addLeadingZero(minutes);
        secondsElem.textContent = addLeadingZero(seconds);
        
    }, 1000)
});


flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
});


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;


  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};
