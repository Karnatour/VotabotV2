function trackToTime(time) {
    time.minutes = Math.floor(time.length / 60);
    time.seconds = time.length - time.minutes * 60;

    if (time.minutes < 10) time.minutes = "0" + time.minutes;
    if (time.seconds < 10) time.seconds = "0" + time.seconds;

    time.embededTime = time.minutes + ":" + time.seconds
}

module.exports = { trackToTime }