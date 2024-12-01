
document.addEventListener('DOMContentLoaded', launchTimer);



function launchTimer() {
    const deadlineDate = new Date('Dec 31, 2024 23:59:59');
    let timerId = setInterval(() => {
        const currentDate = new Date();

        if (deadlineDate <= currentDate) {
            clearInterval(timerId);
        }

        const toGetSeconds = 1000;
        const toGetMinutes = 60 * toGetSeconds;
        const toGetHours = 60 * toGetMinutes;
        const toGetDays = 24 * toGetHours;

        document.getElementById('days').innerText = Math.floor((deadlineDate - currentDate) / toGetDays);
        document.getElementById('hours').innerText = Math.floor(((deadlineDate - currentDate) % toGetDays) / toGetHours);
        document.getElementById('minutes').innerText = Math.floor(((deadlineDate - currentDate) % toGetHours) / toGetMinutes);
        document.getElementById('seconds').innerText = Math.floor(((deadlineDate - currentDate) % toGetMinutes) / toGetSeconds);
    }, 1000);
}