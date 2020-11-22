import React, { useEffect, useRef } from "react";

function renderCanvas(canvas, label, maxValueNum, maxValue, values) {
  var width = canvas.width;
  var height = canvas.height / 2;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "cyan";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (values.length > 1) {
    let [startValue, ...otherValues] = values;

    const xOffset = (maxValueNum - values.length) * (width / (maxValueNum - 1));

    let x = xOffset;
    let y = canvas.height - (height * startValue) / maxValue;

    ctx.beginPath();
    ctx.moveTo(x, y);

    otherValues.forEach((targetValue, index) => {
      x = xOffset + (width / (maxValueNum - 1)) * (index + 1);
      y = canvas.height - (height * targetValue) / maxValue;

      ctx.lineTo(x, y);

      startValue = targetValue;
    });

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(xOffset, canvas.height);
    ctx.fillStyle = "red";
    ctx.fill();

    [startValue, ...otherValues] = values;

    x = xOffset;
    y = canvas.height - (height * startValue) / maxValue;

    ctx.beginPath();
    ctx.moveTo(x, y);

    otherValues.forEach((targetValue, index) => {
      x = xOffset + (width / (maxValueNum - 1)) * (index + 1);
      y = canvas.height - (height * targetValue) / maxValue;

      ctx.lineTo(x, y);

      startValue = targetValue;
    });

    ctx.lineWidth = 5;
    ctx.strokeStyle = "darkred";
    ctx.stroke();

    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(startValue.toFixed(2), canvas.width - 10, +10);
  }

  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(label, 10, +10);
}

function Stat({ width, height, label, maxValueNum, maxValue, values }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    renderCanvas(canvasRef.current, label, maxValueNum, maxValue, values);
  }, [canvasRef, label, maxValueNum, maxValue, values]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default Stat;
