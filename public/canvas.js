const canvas = document.querySelector("canvas");
const pencilColors = document.querySelectorAll(".pencil-color");
const pencilWidth = document.querySelector(".pencil-width");
const eraserWidth = document.querySelector(".eraser-width");
const eraserElem = document.querySelector(".eraser");
const pencilElem = document.querySelector(".pencil");
const download = document.querySelector(".download");
const redo = document.querySelector(".redo");
const undo = document.querySelector(".undo");
// -------------------------------------------------------
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ---------------------------------------
let mouseDown = false;
let pencilColor = "red";
let eraserColor = "white";
let pencilWidthValue = pencilWidth.value;
let eraserWidthValue = eraserWidth.value;
let undoRedoTracker = [];
undoRedoTracker.push(canvas.toDataURL());
let track = 1;
// ----------------------------------------
const tool = canvas.getContext("2d");
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidthValue;
// ----------------------------------------
canvas.addEventListener("mousedown", function (e) {
  mouseDown = true;
  const data = { x: e.clientX, y: e.clientY };
  socket.emit("beginPath", data);
});
canvas.addEventListener("mousemove", function (e) {
  if (mouseDown) {
    const data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : pencilColor,
      width: eraserFlag ? 3 * eraserWidthValue : pencilWidthValue,
    };
    socket.emit("drawStroke", data);
  }
});
canvas.addEventListener("mouseup", function () {
  mouseDown = false;
  const url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.lineWidth = strokeObj.width;
  tool.strokeStyle = strokeObj.color;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}
// -----------------------------------------

pencilColors.forEach((colorElem) => {
  colorElem.addEventListener("click", function () {
    const color = colorElem.classList[0];
    pencilColor = color;
    tool.strokeStyle = pencilColor;
  });
});

pencilWidth.addEventListener("change", function () {
  const width = pencilWidth.value;
  pencilWidthValue = width;
  tool.lineWidth = width;
});

// ----------------------------------------------------

eraserWidth.addEventListener("change", function () {
  const width = eraserWidth.value;
  eraserWidthValue = width;
});

// -----------------------------------------------------

download.addEventListener("click", function () {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "board.jpg");
  a.click();
});

// -----------------------------------------------------

undo.addEventListener("click", function () {
  if (track > 0) {
    --track;
  }
  const data = {
    trackValue: track,
    undoRedoTracker: undoRedoTracker,
  };
  socket.emit("undoRedoCanvas", data);
});
redo.addEventListener("click", function () {
  if (track < undoRedoTracker.length - 1) {
    ++track;
  }
  const data = {
    trackValue: track,
    undoRedoTracker: undoRedoTracker,
  };
  socket.emit("undoRedoCanvas", data);
});

function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;
  tool.clearRect(0, 0, canvas.width, canvas.height);

  const url = undoRedoTracker[track];
  const img = new Image();
  img.setAttribute("src", url);
  img.onload = function () {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}
// -------------------------------------------
socket.on("beginPath", (data) => {
  beginPath(data);
});
socket.on("drawStroke", (data) => {
  drawStroke(data);
});
socket.on("undoRedoCanvas", (data) => {
  undoRedoCanvas(data);
});
