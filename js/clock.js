let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

let radius = canvas.height / 2;
//draw circle at the center of convas
context.translate(radius, radius);
radius *= 0.9;
setInterval(drawClock, 1000);

function drawClock() {
    drawFace(context, radius);
    drawNumbers(context, radius);
    drawSecondsLines(context, radius);
    drawTime(context, radius);
}

function drawFace(context, radius) {
    let gradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fillStyle = "White";
    context.fill();
    gradient = context.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    gradient.addColorStop(0, '#333333');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#333333');

    //use gradient
    context.strokeStyle = gradient;
    context.lineWidth = radius * 0.1;
    context.stroke();


    //draw message
    context.beginPath();
    context.font = "40px Comic Sans MS";
    context.fillStyle = "#80aaff";
    context.textAlign = "center";
    context.fillText("Happy New Year", 0, -80);

    context.font = "15px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("QUARTZ", 0, 140);

}

function drawNumbers(context, radius) {
    let angle, num;
    context.font = radius * 0.15 + 'px arial';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.beginPath();
    context.fillStyle = 'green';
    context.fill();
    for (num = 1; num < 13; num++) {
        angle = num * Math.PI / 6;
        context.rotate(angle);
        context.translate(0, -radius * 0.80);
        context.rotate(-angle);
        context.fillText(num.toString(), 0, 0);
        context.rotate(angle);
        context.translate(0, radius * 0.80);
        context.rotate(-angle);

    }
}


//de desenat liniute intre cifre
function drawSecondsLines(context, radius) {
    let angle, num, min = 0;
    for (num = 0; num < 60; num++) {
        angle = num * Math.PI / 30;

        console.log("angle=" + angle + " Math=" + num * Math.PI / 6)

        if (min % 5 == 0) {
            context.rotate(angle);
            context.translate(0, -radius * 0.90);
            context.rotate(-angle);
            DrawAxe(context, angle, radius * 0.05, radius * 0.02);
            context.rotate(angle);
            context.translate(0, radius * 0.90);
            context.rotate(-angle);
        } else {
            context.rotate(angle);
            context.translate(0, -radius * 0.92);
            context.rotate(-angle);
            DrawAxe(context, angle, radius * 0.03, radius * 0.01);
            context.rotate(angle);
            context.translate(0, radius * 0.92);
            context.rotate(-angle);
        }
        min++;


    }
}
//culoarea la ace

function drawTime(context, radius) {
    let currentTime = new Date();
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();
    let second = currentTime.getSeconds();

    hour = hour % 12;
    //hour angle
    hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (6 * 3600));
    DrawAxe(context, hour, radius * 0.55, radius * 0.07, 'black');
    minute = (minute * Math.PI / 30) + (second * Math.PI / (6 * 360));
    DrawAxe(context, minute, radius * 0.6, radius * 0.04, 'black');
    second = (second * Math.PI / 30);
    DrawAxe(context, second, radius * 0.71, radius * 0.02, 'red');

}

function DrawAxe(context, position, lenght, width, color) {
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = 'round';
    context.moveTo(0, 0);
    context.rotate(position);
    context.lineTo(0, -lenght);
    context.strokeStyle = color;
    context.stroke();
    context.rotate(-position);


}